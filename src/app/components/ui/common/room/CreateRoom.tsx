import { getAmenities } from "@/lib/data";
import CreateRoomForm from "./form/CreateRoomForm";

const CreateRoom = async () => {
  const amenities = await getAmenities();
  if (!amenities) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Room</h1>
      <CreateRoomForm amenities={amenities} />
    </div>
  );
};

export default CreateRoom;
