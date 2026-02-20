import { getAmenities, getBedType, getRoomTypeById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoomType from "./form/EditFormRoomType";

const EditRoomType = async ({ roomId }: { roomId: string }) => {
  const [amenities, room, bedType] = await Promise.all([
    getAmenities(),
    getRoomTypeById(roomId),
    getBedType()
  ]);
  if (!amenities || !room || !bedType) return notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room Type</h1>
      <EditFormRoomType amenities={amenities} bedType={bedType} roomType={room} />
    </div>
  );
};

export default EditRoomType;
