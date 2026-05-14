import FloorPlan2nd from "@/app/components/ui/room/sketch/floorplans/Floor2nd";
import { RoomTypeOptionsProps } from "@/types/room";
import FilterRoomsForm from "../../FilterRoomsForm";
import SectionLabel from "./SectionLabel";

type Props = {
    endDate?: Date | null;
    bookedRooms: string[];
    roomTypeOptions: RoomTypeOptionsProps[];
    filterData: string[];
    onFilterChange: (data: string[]) => void;
    onRoomSelect: (rooms: string[]) => void;
};

const RoomSection = ({ endDate, bookedRooms, roomTypeOptions, filterData, onFilterChange, onRoomSelect }: Props) => (
  <div className="w-full min-[1170px]:w-max md:ml-2 overflow-auto px-2 pt-2 mt-8">
    <h5 className="mb-1.5">Filter Rooms :</h5>
    <FilterRoomsForm roomTypeOptions={roomTypeOptions} onFilterChange={onFilterChange} />
    <SectionLabel step={2} label="Choose Room" className="mt-6 mb-2" />
    <div className="w-full border border-gray-300 p-7 rounded-sm overflow-auto">
      <FloorPlan2nd
        endDate={endDate}
        resetTrigger={endDate}
        bookedRooms={bookedRooms}
        filteredRooms={filterData}
        setSelectedRoomsData={onRoomSelect}
      />
    </div>
  </div>
);

export default RoomSection;