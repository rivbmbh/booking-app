import { getAmenities, getBedType, getRoomTypeById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoomType from "./form/EditFormRoomType";
import PreviousButton from "./button/PreviousButton";

const EditRoomType = async ({ roomTypeId }: { roomTypeId: string }) => {
  const [amenities, roomType, bedType] = await Promise.all([
    getAmenities() ?? [],
    getRoomTypeById(roomTypeId) ?? null,
    getBedType()
  ]);
  if (!amenities || !roomType || !bedType ) return notFound();

  return (
    <div>
      <div className="flex items-end gap-2 mb-3">
        <PreviousButton />
      <h1 className="text-3xl font-bold text-gray-800">Edit a Room Type</h1>
      </div>
      <EditFormRoomType amenities={amenities} roomType={roomType} bedType={bedType}/>
    </div>
  );
};

export default EditRoomType;
