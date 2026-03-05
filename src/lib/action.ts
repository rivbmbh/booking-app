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
        status: status as "AVAILABLE" | "BOOKED" | "MAINTENANCE",
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
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { message: "Please upload an image file" };

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
    if (!file.type.startsWith("image/")) {
      return { message: "File must be an image" };
    }

    if (file.size > 2_000_000) {
      return { message: "Max file size is 2MB" };
    }

    //buat nama file unik untuk menghindari konflik nama file di storage
    const extension = file.name.split(".").pop();
    const filename = `${crypto.randomUUID()}.${extension}`;

    const blob = await put(filename, file, {
      access: "public",
    })
    await prisma.roomType.create({
      data: {
        name,
        description,
        capacity,
        price,
        bedType,
        image: blob.url,
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
        status: status as "AVAILABLE" | "BOOKED" | "MAINTENANCE",
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

  const { name, description, capacity, bedType, price, amenities } = validateFields.data;

  try {
    const file = formData.get("image") as File | null;
    let imageUrl = formData.get("currentImage") as string;

    if(file && file.size > 0){
      if (!file.type.startsWith("image/")) {
        return { message: "File must be an image" };
      }
      if (file.size > 2_000_000) {
        return { message: "Max file size is 2MB" };
      }

      const extension = file.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${extension}`;

      const blob = await put(filename, file, {
        access: "public",
      });

      if(imageUrl){
        await del(imageUrl); //hapus gambar lama dari storage vercel blob
      }

      imageUrl = blob.url; //update url gambar dengan yang baru
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
          image: imageUrl,
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
    await prisma.room.delete({
      where: { id },
    });
  } catch (error) {
    console.info(error);
  }
  revalidatePath("/admin/room"); //auto refresh halaman agar data yang dihapus segera hilang dari UI
};

export const deleteRoomType = async (id: string, image: string) => {
  try {
    await del(image); //hapus gambar dari storage vercel blob

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

  const available = await prisma.room.findFirst({
    where: {
      roomTypeId,
      Reservation: {
        none: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          expiresAt: {
            gt: new Date(),
          },
          AND:[
            {
              startDate:{ lte:endDate },
              endDate:{ gte:startDate }
            }
          ]
        }
      }
    },
  });

  if (!available) {
    return { message: "Sorry, no available room for the selected dates" };
  }

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

  //validasi agar user tidak memilih tanggal check-out sama dengan tanggal check-in
  const night = differenceInCalendarDays(endDate, startDate);
  if (night <= 0) return { messageDate: "Date must be at leats 1 night" };
  const total = night * price;

  let reservationId;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: { name, phone },
        where: { id: session.user.id },
      });

      const reservation = await tx.reservation.create({
        data: {
          userId: session.user.id as string,
          roomId: available!.id as string,
          startDate: startDate,
          endDate: endDate,
          price: price,
          status: "PENDING",
          expiresAt: addMinutes(new Date(), 15),
          Payment: {
            create: {
              amount: total
            }
          }
        },
      });
      reservationId = reservation.id;
    });
  } catch (error) {
    console.info(error);
  }

  redirect(`/checkout/${reservationId}`);
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
