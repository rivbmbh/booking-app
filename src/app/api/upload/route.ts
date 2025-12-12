import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;

  //validasi jika input kosong
  if (file.size === 0 || file.size === undefined) {
    console.info("gambar belum diupload");
    return NextResponse.json(
      { message: "Please upload an image file" },
      { status: 400 }
    );
  }

  //validasi img tidak boleh > 4MB
  if (file.size > 4000000) {
    console.info("gambar berukuran lebih dari 4MB");

    return NextResponse.json(
      { message: "File must be less than 4MB" },
      { status: 400 }
    );
  }

  //cek type img apakah sesuai
  if (!file.type.startsWith("image/")) {
    console.info("yang diupload bukan gambar");

    return NextResponse.json(
      { message: "File must be an image" },
      { status: 400 }
    );
  }

  const blob = await put(file.name, file, {
    access: "public",
    multipart: true,
  });

  console.info("gambar berhasil");

  return NextResponse.json(blob);
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl") as string;
  await del(imageUrl);
  return NextResponse.json({ status: 200 });
};
