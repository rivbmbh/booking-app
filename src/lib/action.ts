"use server";

import { BatchAmenitiesSchema, ContactShecma, IdsSchema, ReserveSchema, RoomSchema, RoomTypeSchema, UpdateAmenitySchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { addMinutes, differenceInCalendarDays } from "date-fns";
import { isRoomNumberExists } from "./utils";
import { BedType } from "@/types/room";
import { BookingStatus, PaymentStatus, ReservationStatus } from "@prisma/client";

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
    bedType: formData.get("bedType"),
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
        bedType: bedType as BedType,
        capacity,
        price,
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

export const saveRoomAmenitiesBatch = async (
  prevState: unknown,
  formData: FormData
) => {
  const raw = formData.getAll("amenities") as string[]

  const parsed = BatchAmenitiesSchema.safeParse({ amenities: raw })

  if (!parsed.success) {
    return {
      error: {
        amenities: parsed.error.issues[0].message,
      },
    }
  }

  const { amenities } = parsed.data

  try {
    const existing = await prisma.amenities.findMany({
      where: {
        name: { in: amenities, mode: "insensitive" },
      },
      select: { name: true },
    })

    if (existing.length > 0) {
      const names = existing.map(e => e.name).join(", ")
      return {
        error: { amenities: `These amenities already exist: ${names}` },
      }
    }

    await prisma.amenities.createMany({
      data: amenities.map(name => ({ name })),
    })

    revalidatePath("/admin/roomamenities")
    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: { amenities: "Something went wrong. Please try again." } }
  }
}

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
    bedType: formData.get("bedType"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    amenities: formData.getAll("amenities") as string[],
  };

  const validateFields = RoomTypeSchema.safeParse(rawData);
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  //data
  const { name, description, bedType, capacity, price, amenities } = validateFields.data;

  try {
    const allFiles = formData.getAll("image") as File[];
    const newFiles = allFiles.filter((file) => file.size > 0); //filter file yang diupload, karena input file tetap mengirim array walaupun tidak ada file yang dipilih 
    const currentImages = formData.getAll("currentImage") as string[]; //ambil url gambar lama dari input hidden

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
          bedType: bedType as BedType,
          capacity,
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

export const updateAmenity = async (
  id: string,
  prevState: unknown,
  formData: FormData
) => {
  const parsed = UpdateAmenitySchema.safeParse({
    name: formData.get("amenities"),
  })

  if (!parsed.success) {
    return {
      error: {
        amenities: parsed.error.issues[0].message,
      },
    }
  }

  const { name } = parsed.data

  try {
    const existing = await prisma.amenities.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        NOT: { id },
      },
    })

    if (existing) {
      return { error: { amenities: "Amenity name already exists." } }
    }

    await prisma.amenities.update({
      where: { id },
      data: { name },
    })

    revalidatePath("/admin/roomamenities")
    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: { amenities: "Failed to update amenity. Please try again." } }
  }
}

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

export const deleteAmenities = async (ids: string[]) => {
  const parsed = IdsSchema.safeParse(ids)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    }
  }

  try {
    const related = await prisma.roomAmenities.findMany({
      where: { amenitiesId: { in: parsed.data } },
      select: { Amenities: { select: { name: true } } },
    })

    if (related.length > 0) {
      const usedNames = [...new Set(related.map(r => r.Amenities.name))]
      return {
        success: false,
        error: `These amenities are still in use: ${usedNames.join(", ")}`,
      }
    }

    const result = await prisma.amenities.deleteMany({
      where: { id: { in: parsed.data } },
    })

    revalidatePath("/admin/roomamenities")
    return { success: true, count: result.count }

  } catch (error) {
    console.error(error)
    return { success: false, error: "Cannot delete amenities. Please try again." }
  }
}

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

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
  };
  
  //validasi input menggunakan zod
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

      if (!available) throw new Error("NO_ROOM_AVAILABLE");
      
      const user = await tx.user.findUnique({ where: { id: session.user.id } });
      if(!user?.phone){
        await tx.user.update({
          where: { id: session.user.id },
          data: { phone },
        });
      }

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
          expiresAt: addMinutes(new Date(), 5),
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
    if (error instanceof Error && error.message === "NO_ROOM_AVAILABLE") {
        return { message: "Sorry, no available room for the selected dates" };
    }
    return { message: "Something went wrong. Please try again." };
  }
    redirect(`/checkout/${bookingId}`);
};

export const createReserveByFloorPlan = async ()=>{
  
}

export const cancelReservation = async (reservationId: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { bookingId: true },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  const { bookingId } = reservation;

  await prisma.$transaction(async (tx) => {
    // 1. Cancel reservation yang diminta
    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CANCELLED },
    });

    // 2. Cek apakah masih ada reservation lain dalam booking ini yang belum cancelled
    const activeReservationsCount = await tx.reservation.count({
      where: {
        bookingId,
        status: { not: ReservationStatus.CANCELLED },
      },
    });

    // 3. Kalau semua reservation dalam booking ini sudah cancelled, baru cancel booking & payment
    if (activeReservationsCount === 0) {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      await tx.payment.updateMany({
        where: {
          bookingId,
          status: { not: PaymentStatus.cancelled },
        },
        data: { status: PaymentStatus.cancelled },
      });
    }
  });

  revalidatePath("/myreservation");
};

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
