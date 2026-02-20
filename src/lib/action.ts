"use server";

import { ContactShecma, ReserveSchema, RoomTypeSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { differenceInCalendarDays } from "date-fns";

export const saveRoom = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Please upload an image file" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    amenities: formData.getAll("amenities"),
  };

  const validateFields = RoomTypeSchema.safeParse(rawData);
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  const { name, description, capacity, price, amenities } = validateFields.data;

  try {
    await prisma.room.create({
      data: {
        name,
        description,
        capacity,
        price,
        image,
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
  redirect("/admin/room");
};

export const saveRoomType = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Please upload an image file" };

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
    await prisma.roomType.create({
      data: {
        name,
        description,
        capacity,
        price,
        bedType,
        image,
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
  redirect("/admin/room");
};


export const updateRoomType = async (
  image: string,
  roomTypeId: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Please upload an image file" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    bedType: formData.get('bedType'),
    price: formData.get("price"),
    amenities: formData.getAll("amenities"),
  };

  const validateFields = RoomTypeSchema.safeParse(rawData);
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  const { name, description, capacity, bedType, price, amenities } = validateFields.data;

  try {
    await prisma.$transaction([
      prisma.roomType.update({
        where: { id: roomTypeId },
        data: {
          name,
          description,
          capacity,
          bedType,
          price,
          image,
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

export const deleteRoom = async (id: string, image: string) => {
  try {
    await del(image); //hapus gambar dari storage vercel blob

    //hapus data room by id
    await prisma.room.delete({
      where: { id },
    });
  } catch (error) {
    console.info(error);
  }
  revalidatePath("/admin/room"); //auto refresh halaman agar data yang dihapus segera hilang dari UI
};

export const createReserve = async (
  roomId: string,
  price: number,
  startDate: Date,
  endDate: Date,
  prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    redirect(`/signin?redirect_url=room/${roomId}`);

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
          startDate: startDate,
          endDate: endDate,
          price: price,
          roomId: roomId,
          userId: session.user.id as string,
          Payment: {
            create: {
              amount: total,
            },
          },
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
