"use client";
import { saveRoomType } from "@/lib/action";
import { Amenities, BedType } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import { useActionState, useRef, useState, } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

const CreateRoomTypeForm = ({ amenities, bedType }: { amenities: Amenities[], bedType: BedType[] }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  console.info(preview)
  const handlePreview = () => {
    const file = inputFileRef.current?.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const [state, formAction, isPending] = useActionState(
    saveRoomType,
    null
  );
  return (
    <form action={formAction}>
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
          {/* IMAGE UPLOAD */}
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-md cursor-pointer relative mb-4"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <>
                <IoCloudUploadOutline className="size-8 text-gray-500" />
                <p className="text-sm">Select Image</p>
              </>
            )}

            <input
              type="file"
              name="image"
              id="image"
              ref={inputFileRef}
              onChange={handlePreview}
              className="hidden"
              accept="image/*"
            />
          </label>
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
