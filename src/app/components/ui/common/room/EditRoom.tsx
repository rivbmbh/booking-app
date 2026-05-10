import { getRoomById, getRoomType } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoom from "./form/EditFormRoom";

const EditRoom = async ({ roomId }: { roomId: string }) => {
  const [room, roomType] = await Promise.all([
    getRoomById(roomId),
    getRoomType(),
  ]);
  if (!room || !roomType) return notFound();
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room</h1>
      <EditFormRoom room={room} roomType={roomType} />
    </div>
  );
};

export default EditRoom;
