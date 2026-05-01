import CreateRoomForm from "./form/CreateRoomForm";
import { getBedType, getRoomType } from "@/lib/data";

const CreateRoom = async () => {
  const roomType = await getRoomType() ?? [];
  const bedType = await getBedType() ?? [];
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Room</h1>
      <CreateRoomForm roomType={roomType} bedType={bedType} />
    </div>
  );
};

export default CreateRoom;
