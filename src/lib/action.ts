"use server";

import { ContactShecma, RoomSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

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

  const validateFields = RoomSchema.safeParse(rawData);
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
