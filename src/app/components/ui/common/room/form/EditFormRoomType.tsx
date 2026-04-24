"use client";

import { updateRoomType } from "@/lib/action";
import { RoomTypeProps } from "@/types/room";
import { Amenities } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useActionState, useRef, useState } from "react";
import { IoCloseCircleSharp, IoCloudUploadOutline } from "react-icons/io5";
import imageCompression from "browser-image-compression";
import { set } from "zod";

const EditFormRoomType
 = ({
  amenities,
  bedType,
  roomType
}: {
  amenities: Amenities[];
  bedType: string[]
  roomType: RoomTypeProps;
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(roomType.image || []);
  const [existingUrls, setExistingUrls] = useState<string[]>(roomType.image || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handlePreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    
    const currentTotal = existingUrls.length + newFiles.length;
    const remaining = 3 - currentTotal;
    if(remaining <= 0) return;

    const toProcess = selected.slice(0, remaining);

    //kompress gambar jika lebih dari 300kb 
    // const compressedFiles: File[] = [];
    const newPreviews = toProcess.map((file) => URL.createObjectURL(file));

    // for( const file of toProcess) {
    //   try {
    //     const compressed = await imageCompression(file, {
    //       maxSizeMB: 0.5,
    //       maxWidthOrHeight: 1920,
    //       useWebWorker: true,
    //     })
    //     compressedFiles.push(compressed);
    //     newPreviews.push(URL.createObjectURL(compressed));
    //   } catch (error) {
    //     console.error("Error compressing image:", error);
    //   }
    // }
    
    
    setNewFiles((prev) => [...prev, ...toProcess]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < existingUrls.length;
    if (isExistingImage) {
      setExistingUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - existingUrls.length;
      URL.revokeObjectURL(previews[index]);
      setNewFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const [state, formAction, isPending] = useActionState(
    updateRoomType.bind(null, roomType.id),
    null
  );

  const handleSubmit = async (formData: FormData) => {
    // Kirim gambar lama yang masih ada
    formData.delete("currentImage");
    existingUrls.forEach((url) => formData.append("currentImage", url));

    // Kirim file baru
    formData.delete("image");
    newFiles.forEach((file) => formData.append("image", file));

    return formAction(formData);
  }

    const totalImages = existingUrls.length + newFiles.length;
  //untuk input checkbox Amenities
  const checkedAmenities = roomType.RoomAmenities.map((item) => item.amenitiesId);

  return (
    <form action={handleSubmit}>
      <div className="grid md:grid-cols-12 gap-5">
        <div className="col-span-8 bg-white p-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              defaultValue={roomType.name}
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Room name"
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.name}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <select name="bedType" className="py-2 px-4 rounded-sm border border-gray-400 w-full" defaultValue={roomType.bedType}>
              <option value="" disabled>-Choose Room Type-</option>
              {bedType.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>
            <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500 mt-2">
                  {state?.error?.bedType}
                </span>
            </div>
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              defaultValue={roomType.description}
              rows={8}
              placeholder="Description"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.description}
              </span>
            </div>
          </div>
          <div className="mb-4 grid md:grid-cols-3">
            {amenities.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="amenities"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  defaultValue={item.id}
                  defaultChecked={checkedAmenities.includes(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="ms-2 text-sm font-medium text-gray-900 capitalize"
                >
                  {item.name}
                </label>
              </div>
            ))}
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.amenities}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-white p-4">
          {/* general message */}
          {state?.message ? (
            <div className="mb-4 bg-red-500 p-2 rounded-l-sm rounded-br-sm">
              <span className="text-sm text-gray-100">{state.message}</span>
            </div>
          ) : null}
          {/* IMAGE UPLOAD */}
          <div className="mb-4">
            <input type="hidden" name="currentImage" value={roomType.image} />
            {previews.length === 0 ? (
              // Tampilkan upload zone jika belum ada gambar
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-md cursor-pointer"
              >
                <IoCloudUploadOutline className="size-8 text-gray-500" />
                <p className="text-sm text-gray-500">Select up to 3 images</p>
                <input
                  type="file"
                  name="image"
                  id="image"
                  ref={inputFileRef}
                  onChange={handlePreview}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </label>
            ) : (
              // Swiper preview
              <div className="relative aspect-video rounded-md overflow-hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  className="w-full h-full"
                >
                  {previews.map((src, i) => (
                    <SwiperSlide key={i} className="relative">
                      <Image
                        src={src  || '/placeholder-image.webp'}
                        alt={`Preview ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Tombol hapus per gambar */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 z-10 text-white group"
                      >
                        <IoCloseCircleSharp className="size-6 text-red-500 group-hover:scale-110 transition-all ease-in-out duration-500" />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Tombol tambah gambar jika belum 3 */}
                {totalImages < 3 && (
                  <label
                    htmlFor="image"
                    className="absolute bottom-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                  >
                    <IoCloudUploadOutline className="size-4" />
                    Add more ({totalImages}/3)
                    <input
                      type="file"
                      id="image"
                      ref={inputFileRef}
                      onChange={handlePreview}
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                  </label>
                )}
              </div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="capacity"
              defaultValue={roomType.capacity}
              placeholder="Capacity..."
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.capacity}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="price"
              defaultValue={roomType.price}
              placeholder="Price..."
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.price}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={clsx(
              "bg-orange-400 text-white w-full hover:bg-orange-500 py-2.5 px-6 md:px-1 text-lg font-semibold cursor-pointer",
              {
                "opacity-50 cursor-progress": isPending,
              }
            )}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditFormRoomType
;
