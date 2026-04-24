"use server";

import { ContactShecma, ReserveSchema, RoomSchema, RoomTypeSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { addMinutes, differenceInCalendarDays } from "date-fns";
import { isRoomNumberExists } from "./utils";

export const saveRoom = async (prevState: unknown, formData: FormData) => {
if (!formData.get("floor") || !formData.get("roomNumber")) {
    return { message: "Please select floor and input room number" };
  }

  const rawData = {
    roomNumber: formData.get("roomNumber"),
    floor: parseInt(formData.get("floor") as string),
    status:  formData.get("status"),
    roomType: formData.get("roomType"),
  }

  //validasi input menggunakan zod
  const validateFields = RoomSchema.safeParse(rawData);
  if (!(await validateFields).success) {
    const error = (await validateFields).error!.flatten().fieldErrors;
    return { error };
  }

  const { roomNumber, floor,  status, roomType } = (await validateFields).data!;  

  const exists = await isRoomNumberExists(roomNumber);

  if (exists) {
    return {
      error: {
        roomNumber: ["Room number already exists"]
      }
    };
  }

  try {
    await prisma.room.create({
      data:{
        roomNumber: roomNumber,
        floor,
        status: status as "ACTIVE" | "INACTIVE",
        roomTypeId: roomType as string,
      }
    })
  } catch (error) {
    console.info(error);  
  }
  redirect("/admin/room");
}

export const saveRoomType = async (
  prevState: unknown,
  formData: FormData
) => {
  const files = formData.getAll("image") as File[] | null;
  if (!files || files.length === 0) return { message: "Please upload an image file" };

  if(files.length > 3) return { message: "Maximum 3 images allowed" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    bedType: formData.get('bedType'),
    amenities: formData.getAll("amenities"),
  };

  const validateFields = RoomTypeSchema.safeParse(rawData);

  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  const { name, description, capacity, price, bedType, amenities } = validateFields.data;

  try {
    for(const file of files){
      if(!file.type.startsWith("image/")){
        return { message: "All files must be an image" };
      }
      if(file.size > 2_000_000){
        return { message: "Max file size is 2MB" };
      }
    }

    const uploadPromises = files.map( async (file) => {
      const extension = file.name.split(".").pop()
      const filename = `${crypto.randomUUID()}.${extension}`;
      const blob = await put(filename, file, {
        access: "public",
      });
      return blob.url;
    })

    const imageUrls = await Promise.all(uploadPromises);

    await prisma.roomType.create({
      data: {
        name,
        description,
        capacity,
        price,
        bedType,
        image: imageUrls,
        RoomAmenities: {
          createMany: {
            data: amenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.info(error);
  }
  redirect("/admin/roomtype");
};

export const updateRoom = async (
  roomId: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!formData.get("floor") || !formData.get("roomNumber")) {
    return { message: "Please select floor and input room number" };
  }

  const rawData = {
    roomNumber: formData.get("roomNumber"),
    floor: parseInt(formData.get("floor") as string),
    status:  formData.get("status"),
    roomType: formData.get("roomType"),
  }

  //validasi input menggunakan zod
  const validateFields = RoomSchema.safeParse(rawData);
  if (!(await validateFields).success) {
    const error = (await validateFields).error!.flatten().fieldErrors;
    return { error };
  }

  const { roomNumber, floor, status, roomType } = (await validateFields).data!;  

  // cek duplicate khusus update
  const exists = await isRoomNumberExists(roomNumber, roomId);

  if (exists) {
    return {
      error: {
        roomNumber: ["Room number already exists"]
      }
    };
  }

  try {
    await prisma.room.update({
      where: { id: roomId },
      data:{
        roomNumber: roomNumber,
        floor,
        status: status as "ACTIVE" | "INACTIVE",
        roomTypeId: roomType as string,
      }
    })
  } catch (error) {
    console.info(error);  
  }
  redirect("/admin/room");
}

export const updateRoomType = async ( 
  roomTypeId: string,
  prevState: unknown,
  formData: FormData
) => {

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    bedType: formData.get('bedType'),
    price: formData.get("price"),
    amenities: formData.getAll("amenities") as string[],
  };

  const validateFields = RoomTypeSchema.safeParse(rawData);
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  //data
  const { name, description, capacity, bedType, price, amenities } = validateFields.data;

  try {
    const allFiles = formData.getAll("image") as File[];
    const newFiles = allFiles.filter((file) => file.size > 0); //filter file yang diupload, karena input file tetap mengirim array walaupun tidak ada file yang dipilih 
    let currentImages = formData.getAll("currentImage") as string[]; //ambil url gambar lama dari input hidden

    const totalImages = currentImages.length + newFiles.length;
    if(totalImages === 0) return { message: "Please upload at least one image" };
    if(totalImages > 3) return { message: "Maximum 3 images allowed" };
    let finalImageUrls: string[] = [...currentImages];

    if(newFiles.length > 0){
      for(const file of newFiles){
        if(!file.type.startsWith("image/")){
          return { message: "All files must be an image" };
        } 
        if(file.size > 2_000_000){      
          return { message: "Max file size is 2MB" };
        }
      
    }

      // Upload semua file baru bersamaan
      const uploadResults = await Promise.all(
        newFiles.map(async (file) => {
          const mimeToExt: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
            "image/gif": "gif",
            "image/avif": "avif",
          };
          const extension = mimeToExt[file.type] ?? "jpg";
          const filename = `${crypto.randomUUID()}.${extension}`;
          const blob = await put(filename, file, { access: "public" });
          return blob.url;
        })
      );
      finalImageUrls = [...finalImageUrls, ...uploadResults];
    }

    const existing = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      select: { image: true } 
    });

    const deletedImages = (existing?.image || []).filter(
      (url) => !currentImages.includes(url)
    );

    // Hapus gambar yang sudah tidak dipakai dari storage
    if (deletedImages.length > 0) {
      await Promise.all(deletedImages.map((url) => del(url)));
    }

    await prisma.$transaction([
      prisma.roomType.update({
        where: { id: roomTypeId },
        data: {
          name,
          description,
          capacity,
          bedType,
          price,
          image: finalImageUrls,
          RoomAmenities: {
            deleteMany: {}, // hapus semua data amenities yang berelasi
          },
        },
      }),
      // dan masukan data baru
      prisma.roomAmenities.createMany({
        data: amenities.map((item) => ({
          roomTypeId,
          amenitiesId: item,
        })),
      }),
    ]);
  } catch (error) {
    console.info(error);
  }
  revalidatePath("/admin/roomtype");
  redirect("/admin/roomtype ");
};

export const deleteRoom = async (id: string) => {
  try {
    //hapus data room by id 
    await prisma.room.update({
      where: { id },
      data: {
        status: "INACTIVE",
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.info(error);
  }
  revalidatePath("/admin/room"); //auto refresh halaman agar data yang dihapus segera hilang dari UI
};

export const deleteRoomType = async (id: string, images: string[]) => {
  try {
    for (const image of images) {
      await del(image); //hapus gambar dari storage vercel blob
    }
    //hapus data amenities yang berelasi dengan roomtype  
    await prisma.roomAmenities.deleteMany({
      where: { roomTypeId: id },
    }); 

    //hapus data roomtype by id
    await prisma.roomType.delete({
      where: { id },
    });
  } catch (error) {
    console.info(error);
  }
  revalidatePath("/admin/roomtype"); //auto refresh halaman agar data yang dihapus segera hilang dari UI
};


export const createReserve = async (
  roomTypeId: string,
  price: number,
  startDate: Date,
  endDate: Date,
  prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    redirect(`/signin?redirect_url=room/${roomTypeId}`);

  //cek ketersediaan kamar untuk tanggal yang dipilih
  const available = await prisma.room.findFirst({
    where: {
      roomTypeId,
      Reservations: {
        none: {
          OR: [
            {
              status: "CONFIRMED",
              AND: [
                { startDate: { lt: endDate } },
                { endDate: { gt: startDate } }
              ]
            },
            {
              status: "PENDING",
              expiresAt: { gt: new Date() },
              AND: [
                { startDate: { lt: endDate } },
                { endDate: { gt: startDate } }
              ]
            }
          ]
        }
      }
    },
  });
  console.info(available)
  //jika tidak ada kamar yang tersedia untuk tanggal yang dipilih, kembalikan pesan error
  if (!available) {
    return { message: "Sorry, no available room for the selected dates, please choose another date" };
  }

  //validasi input menggunakan zod
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
  };

  const validateFields = ReserveSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, phone } = validateFields.data;

  //hitung total harga berdasarkan lama menginap (jumlah malam) dikali harga per malam
  const night = differenceInCalendarDays(endDate, startDate);
  if (night <= 0) return { messageDate: "Date must be at leats 1 night" };
  const total = night * price;
  let bookingId;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { phone },
      });

      const booking = await tx.booking.create({
        data: {
          userId: session.user.id as string,
          startDate,
          endDate,
          status: "PENDING",
          totalPrice: total
        }
      })

      await tx.reservation.create({
        data: {
          guestName: name,
          guestPhone: phone,
          bookingId: booking.id,
          roomId: available!.id as string,
          startDate,
          endDate,
          price,
          status: "PENDING",
          expiresAt: addMinutes(new Date(), 30),
        },
      });

      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: total
        }
      });

      bookingId = booking.id
    });

  } catch (error) {
    console.error("Reservation error:", error);

    return {
      message: "Something went wrong while creating reservation. Please try again.",
    };
  }
    redirect(`/checkout/${bookingId}`);
};



export const createReserveByFloorPlan = async ()=>{
  
}

export const cancelReservation = async (reservationId: string) => {
  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: { status:  "CANCELLED"}
    }),

    prisma.payment.updateMany({
      where: {reservationId},
      data: {status: "cancelled"}
    })
  ])
  revalidatePath("/myreservation")
}

export const ContactMessage = async (
  previewState: unknown,
  formData: FormData
) => {
  const validateFields = ContactShecma.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  const { name, email, subject, message } = validateFields.data;

  try {
    await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });
    return { message: "Thanks for contact us" };
  } catch (error) {
    console.info(error);
  }
};
