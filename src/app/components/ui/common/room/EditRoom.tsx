import { getRoomById, getRoomType } from "@/lib/data";
import { notFound } from "next/navigation";
import EditFormRoom from "./form/EditFormRoom";
import PreviousButton from "./button/PreviousButton";

const EditRoom = async ({ roomId }: { roomId: string }) => {
  const [room, roomType] = await Promise.all([
    getRoomById(roomId),
    getRoomType(),
  ]);
  if (!room || !roomType) return notFound();
  
  return (
    <div>
      <div className="flex items-end gap-2 mb-3">
        <PreviousButton />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room</h1>
      </div>
      <EditFormRoom room={room} roomType={roomType} />
    </div>
  );
};

export default EditRoom;
