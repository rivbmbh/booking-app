import { getDisabledRoomById, getRoomDetailById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { IoCheckmark, IoPeopleOutline } from "react-icons/io5";
import ReserveForm from "../ReserveForm";
import ImageGallery from "../ImageGallery";

const RoomDetailUser = async ({ roomId }: { roomId: string }) => {
  const [room, disabledDate] = await Promise.all([
    getRoomDetailById(roomId),
    getDisabledRoomById(roomId),
  ]);
  if (!room || !disabledDate) return notFound();
  return (
    <div className="max-w-screen-2xl py-16 px-4 grid lg:grid-cols-12 gap-8 mx-auto  ">
      <div className="sm:col-span-6 md:col-span-7">
        <ImageGallery image={room.RoomType?.image} />
        <h1 className="text-5xl font-bold text-gray-900 mb-8 pt-3">
          {room.RoomType?.name}
        </h1>
        <p>{room.RoomType?.description}</p>
        <h5 className="text-[20px] font-semibold py-1 mt-1">Amenities :</h5>
        <div className="grid md:grid-cols-3">
          {room.RoomType.RoomAmenities.map((item) => (
            <div key={item.id} className="flex gap-1 py-1">
              <div className=" bg-emerald-400 rounded-full p-1 text-white">
                <IoCheckmark className="size-4" />
              </div>
              <span>{item.Amenities.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-auto xs:mx-auto sm:col-span-6 md:w-auto md:col-span-5">
        <div className="border-2 border-gray-300 border-dashed px-3 2xl:px-4 py-5 bg-old-paper rounded-none">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <IoPeopleOutline className="size-4" />
              <span>
                {room.RoomType?.capacity} {room.RoomType?.capacity === 1 ? "Person" : "People"}
              </span>
            </div>
            <div className="flex items-center ">
              <span className="text-2xl font-semibold text-gray-700">
                {formatCurrency(room.RoomType?.price)}
              </span>
              <span className="text-gray-400">/Night</span>
            </div>
          </div>
          {/*Reservation Form */}
          <ReserveForm room={room} disabledDate={disabledDate} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetailUser;
