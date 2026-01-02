"use client";
import Image from "next/image";
import { useState } from "react";

const ImagesCardInput = ({ image }: { image: string }) => {
  const [imageList, setImageList] = useState<string[]>([
    image,
    "/hero3.jpg",
    "/hero2.jpg",
  ]);

  function handleThumbnailClick(ClickedImage: string) {
    const clickedIndex = imageList.indexOf(ClickedImage);
    if (clickedIndex === -1) return;

    setImageList((prevImageList) => {
      const updatedImageList = [...prevImageList];
      // swap primary image dengan image yang diklik
      [updatedImageList[0], updatedImageList[clickedIndex]] = [
        updatedImageList[clickedIndex],
        updatedImageList[0],
      ];

      return updatedImageList;
    });
  }
  return (
    <div className="aspect-video relative w-full mb-2">
      <Image
        src={imageList[0]}
        alt="Room Image"
        width={200}
        height={100}
        className="object-cover w-full rounded-2xl aspect-video"
      />
      <div className="absolute left-3 bottom-3 object-cover flex gap-4 justify-evenly">
        {imageList.slice(1).map((thumbnail, index) => (
          <div key={index} className="cursor-pointer">
            <Image
              src={thumbnail}
              alt="Room Image"
              width={50}
              height={30}
              onClick={() => handleThumbnailClick(thumbnail)}
              className="object-cover w-full rounded-md border border-dashed border-gray-300 aspect-video hover:scale-110 transition-all duration-200 ease-in-out"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesCardInput;
