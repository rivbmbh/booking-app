import { getDisabledRoomTypeById, getRoomTypeDetailById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { IoCheckmark, IoPeopleOutline } from "react-icons/io5";
import ReserveForm from "../ReserveForm";
import ImageGallery from "../ImageGallery";

const RoomDetailUser = async ({ roomTypeId }: { roomTypeId: string }) => {
  console.info(roomTypeId)
  const [room, disabledDate] = await Promise.all([
    getRoomTypeDetailById(roomTypeId),
    getDisabledRoomTypeById(roomTypeId),
  ]);
  if (!room || !disabledDate) return notFound();
  return (
    <div className="max-w-screen-2xl py-16 px-4 grid lg:grid-cols-12 gap-8 mx-auto  ">
      <div className="sm:col-span-6 md:col-span-7">
        <div className="w-full rounded-full pr-2 md:p-0">
          <ImageGallery image={room.image} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 pt-3">
          {room.name}
        </h1>
        <p className="tracking-wider mb-4">{room.description}</p>
        <h5 className="text-lg font-semibold py-1 mt-1">Amenities :</h5>
        <div className="grid md:grid-cols-3">
          {room.RoomAmenities.map((item) => (
            <div key={item.id} className="flex gap-1 py-1">
              <div className=" bg-emerald-400 rounded-full p-1 text-white">
                <IoCheckmark className="size-4" />
              </div>
              <span className="font-light">{item.Amenities.name}</span>
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
                {room.capacity} {room.capacity === 1 ? "Person" : "People"}
              </span>
            </div>
            <div className="flex items-center ">
              <span className="text-2xl font-semibold text-gray-700">
                {formatCurrency(room.price)}
              </span>
              <span className="text-gray-400">/Night</span>
            </div>
          </div>
          {/*Reservation Form */}
          <ReserveForm roomType={room} disabledDate={disabledDate as []} />
          <p className="text-sm font-italic text-gray-500 mt-2">
            *if you want to reserve more than 1 room, please make another reservation after you complete the first reservation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailUser;
