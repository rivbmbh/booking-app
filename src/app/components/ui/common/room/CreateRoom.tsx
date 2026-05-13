import { getRoomType } from "@/lib/data";
import CreateRoomForm from "./form/CreateRoomForm";
import PreviousButton from "./button/PreviousButton";

const CreateRoom = async () => {
  const roomType = await getRoomType() ?? [];
  if(!roomType){
    return null
  }
  return (
    <div>
      <div className="flex items-end gap-2 mb-3">
        <PreviousButton />
        <h1 className="text-3xl font-bold text-gray-800">Create New Room</h1>
      </div>
      <CreateRoomForm roomType={roomType} />
    </div>
  );
};

export default CreateRoom;
