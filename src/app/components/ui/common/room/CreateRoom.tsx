import { getRoomType } from "@/lib/data";
import CreateRoomForm from "./form/CreateRoomForm";

const CreateRoom = async () => {
  const roomType = await getRoomType() ?? [];
  if(!roomType){
    return null
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Room</h1>
      <CreateRoomForm roomType={roomType} />
    </div>
  );
};

export default CreateRoom;
