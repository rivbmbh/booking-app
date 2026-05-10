import { getAmenities, getBedType, getRoomTypeById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoomType from "./form/EditFormRoomType";

const EditRoomType = async ({ roomTypeId }: { roomTypeId: string }) => {
  const [amenities, roomType, bedType] = await Promise.all([
    getAmenities() ?? [],
    getRoomTypeById(roomTypeId) ?? null,
    getBedType()
  ]);
  if (!amenities || !roomType || !bedType ) return notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room Type</h1>
      <EditFormRoomType amenities={amenities} roomType={roomType} bedType={bedType}/>
    </div>
  );
};

export default EditRoomType;
