import CreateAmenitiesForm from "./form/CreateAmenitiesForm";

const CreateAmenities = async () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Amenities</h1>
      <CreateAmenitiesForm />
      {/* Create batch or use modal  */}
    </div>
  );
};

export default CreateAmenities;
