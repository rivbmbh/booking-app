import CreateAmenitiesForm from "./form/CreateAmenitiesForm";
import PreviousButton from "./button/PreviousButton";

const CreateAmenities = async () => {
  return (
    <div>
       <div className="flex items-end gap-2 mb-3">
        <PreviousButton />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Amenities</h1>
      </div>
      <CreateAmenitiesForm />
      {/* Create batch or use modal  */}
    </div>
  );
};

export default CreateAmenities;
