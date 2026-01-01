import Image from "next/image";

const ImagesCardInput = ({ image }: { image: string }) => {
  return (
    <div className="aspect-video relative w-full mb-2">
      <Image
        src={image}
        alt="Room Image"
        width={200}
        height={100}
        className="object-cover w-full rounded-2xl aspect-video"
      />
      <div className="absolute left-3 bottom-3 object-cover flex gap-4 justify-evenly">
        <div className="cursor-pointer">
          <Image
            src={image}
            alt="Room Image"
            width={50}
            height={30}
            className="object-cover w-full rounded-md border border-dashed border-gray-300 aspect-video hover:scale-110 transition-all duration-200 ease-in-out"
          />
        </div>
        <div className=" cursor-pointer">
          <Image
            src={image}
            alt="Room Image"
            width={50}
            height={30}
            className="object-cover w-full rounded-md border border-dashed border-gray-300 aspect-video hover:scale-110 transition-all duration-200 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagesCardInput;
