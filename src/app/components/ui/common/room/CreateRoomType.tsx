import { getAmenities, getBedType } from "@/lib/data";
import CreateRoomTypeForm from "./form/CreateRoomTypeForm";
import PreviousButton from "./button/PreviousButton";

const CreateRoomType = async () => {
  const amenities = await getAmenities();
  const bedType = await getBedType() ?? [];

  if (!amenities) return null;
  return (
    <div>
       <div className="flex items-end gap-2 mb-3">
        <PreviousButton />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Room Type</h1>
      </div>
      <CreateRoomTypeForm amenities={amenities} bedType={bedType}/>
    </div>
  );
};

export default CreateRoomType;
