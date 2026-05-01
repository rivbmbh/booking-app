import { getBedType, getRoomById, getRoomType } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoom from "./form/EditFormRoom";

const EditRoom = async ({ roomId }: { roomId: string }) => {
  const [room, roomType, bedType] = await Promise.all([
    getRoomById(roomId),
    getRoomType(),
    getBedType(),
  ]);
  if (!room || !roomType || !bedType) return notFound();
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room</h1>
      <EditFormRoom room={room} roomType={roomType} bedType={bedType} />
    </div>
  );
};

export default EditRoom;
