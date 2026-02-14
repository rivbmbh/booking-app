import { getAmenities, getBedType } from "@/lib/data";
import CreateRoomTypeForm from "./CreateRoomTypeForm";

const CreateRoomType = async () => {
  const amenities = await getAmenities();
  const bedType = await getBedType()
  if (!amenities) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Room Type</h1>
      <CreateRoomTypeForm amenities={amenities} bedType={bedType}/>
    </div>
  );
};

export default CreateRoomType;
