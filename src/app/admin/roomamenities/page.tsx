import ModalCreateAmenities from "@/app/components/ui/common/room/form/ModalCreateAmenities";
import RoomAmenitiesTable from "@/app/components/ui/common/room/table/RoomAmenitiesTable";
import { Suspense } from "react";

const RoomAmenities = () => {
  return (
    <div className="max-w-screen-2xl px-4 py-16 mt-10 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Room Amenities List</h1>
        <div className="flex gap-7 justify-between">
            <ModalCreateAmenities/>
        </div>
      </div>
      <Suspense fallback={<p>Loading data...</p>}>
        <RoomAmenitiesTable />
      </Suspense>
    </div>
  );
};

export default RoomAmenities;
