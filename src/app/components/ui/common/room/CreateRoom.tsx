import { getAmenities } from "@/lib/data";
import CreateForm from "./CreateForm";

const CreateRoom = async () => {
  const amenities = await getAmenities();
  if (!amenities) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create new room</h1>
      <CreateForm amenities={amenities} />
    </div>
  );
};

export default CreateRoom;
