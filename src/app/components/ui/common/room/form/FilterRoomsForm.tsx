import { RoomTypeOptionsProps } from "@/types/room"

const FilterRoomsForm = ({ roomTypeOptions, bedTypeOptions }: { roomTypeOptions: RoomTypeOptionsProps[], bedTypeOptions: string[] }) => {
  
    return (
        <div className="flex flex-wrap gap-2 mb-8 md:mb-4 bg-gray-100 rounded-sm items-center my-auto py-4 px-3">
            <select name="room_type"className="bg-white w-24 h-10 px-2 placeholder:text-sm placeholder:text-gray-600 outline-none ring-0 border border-gray-300 rounded-md w-max active:ring-2 active:ring-primary focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out">
                <option value="all">All Room Types</option>
                {roomTypeOptions.map((roomType) => (
                    <option key={roomType.id} value={roomType.id}>
                        {roomType.name}
                    </option>
                ))}
            </select>
            <select name="bed_type"className="bg-white w-24 h-10 px-2 placeholder:text-sm placeholder:text-gray-600 outline-none ring-0 border border-gray-300 rounded-md w-max active:ring-2 active:ring-primary focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out">
                <option value="all">All Bed Types</option>
                {bedTypeOptions.map((bedType) => (
                    <option key={bedType} value={bedType}>
                        {bedType}
                    </option>
                ))}
            </select>
            <button className="bg-primary text-white w-max h-10 px-4 md:ml-2 rounded-md hover:bg-primary-hover">Apply Filters</button>
        </div>
    )
}

export default FilterRoomsForm