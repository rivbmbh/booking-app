"use client";
import { saveRoomType } from "@/lib/action";
import { Amenities, BedType } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import { useActionState, useRef, useState, } from "react";
import { IoCloseCircleSharp, IoCloudUploadOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CreateRoomTypeForm = ({ amenities, bedType }: { amenities: Amenities[], bedType: BedType[] }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])

    const remaining = 3 - files.length;
    const toAdd = selected.slice(0, remaining);

    const newPreviews = toAdd.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreviews])
    setFiles((prev) => [...prev, ...toAdd])

    e.target.value = "";

  };

  const removeImage =  (index: number) => {
    URL.revokeObjectURL(previews![index]);
    setPreview((prev) => prev!.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index)); 
  }

  const [state, formAction, isPending] = useActionState(
    saveRoomType,
    null
  );

  const handleSubmit = async (formData: FormData) => {
    formData.delete("image");
    files.forEach((file) => formData.append("image", file));
    return formAction(formData);
  };
  return (
    <form action={handleSubmit}>
      <div className="grid md:grid-cols-12 gap-5">
        <div className="col-span-8 bg-white p-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
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
          <select name="bedType" className="py-2 px-4 rounded-sm border border-gray-400 w-full">
            <option value="">-Choose Room Type-</option>
            {bedType.map((type) => (
                <option key={type} value={type}>{type}</option>
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
                {files.length < 3 && (
                  <label
                    htmlFor="image"
                    className="absolute bottom-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                  >
                    <IoCloudUploadOutline className="size-4" />
                    Add more ({files.length}/3)
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
              type="number"
              name="capacity"
              min={1}
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
              type="number"
              name="price"
              placeholder="Price..."
              min={0} step="0.01" 
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

export default CreateRoomTypeForm;
