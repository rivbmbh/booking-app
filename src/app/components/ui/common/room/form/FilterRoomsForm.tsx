import { RoomTypeOptionsProps } from "@/types/room"
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    roomTypeOptions: RoomTypeOptionsProps[];
    bedTypeOptions: string[];
    onFilterChange: (data: string[]) => void;
}

const FilterRoomsForm = ({ roomTypeOptions, bedTypeOptions, onFilterChange }: Props) => {
    const [selectedRoomType, setSelectedRoomType] = useState("all");
    const [selectedBedType, setSelectedBedType] = useState("all");
    const [isLoading, setIsLoading] = useState(false);


    const handleApplyFilter = async () => {
        if(selectedRoomType === "all" && selectedBedType === "all"){
            onFilterChange([]);
            return
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/room/filter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    roomTypeId: selectedRoomType,
                    bedTypeName: selectedBedType
                })
            })
            if (!res.ok) {
                const errorData = await res.json();
                Swal.fire({ icon: "error", title: "Error", text: errorData.message });
                return;
            }
            const data = await res.json();
            console.info("filtered rooms", data)
            onFilterChange(data.roomNumbers);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to filter rooms"
            });
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setSelectedRoomType("all");
        setSelectedBedType("all");
        onFilterChange([]);
    };

    return (
        <div className="flex flex-wrap justify-evenly sm:justify-start gap-2 mb-8 md:mb-4 bg-gray-100 rounded-sm items-center my-auto py-4 px-3">
            <select name="room_type"className="bg-white h-10 px-2 placeholder:text-sm placeholder:text-gray-600 outline-none ring-0 border border-gray-300 rounded-md w-max active:ring-2 active:ring-primary focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
                <option value="all">All Room Types</option>
                {roomTypeOptions.map((roomType) => (
                    <option key={roomType.id} value={roomType.id}>
                        {roomType.name}
                    </option>
                ))}
            </select>
            <select name="bed_type"className="bg-white h-10 px-2 placeholder:text-sm placeholder:text-gray-600 outline-none ring-0 border border-gray-300 rounded-md w-max active:ring-2 active:ring-primary focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" value={selectedBedType} onChange={(e) => setSelectedBedType(e.target.value)}>
                <option value="all">All Bed Types</option>
                {bedTypeOptions.map((bedType) => (
                    <option key={bedType} value={bedType}>
                        {bedType}
                    </option>
                ))}
            </select>

            <div className="md:ml-5 flex flex-wrap justify-center items-center gap-2 mt-4 md:mt-0">
                <button type="button" className="bg-primary text-white w-max h-10 px-4 rounded-md hover:bg-primary-hover active:scale-105"  onClick={handleReset}>
                    Reset Filters
                </button>
                <button type="button" className="bg-primary text-white w-max h-10 px-4 rounded-md hover:bg-primary-hover active:scale-105" onClick={handleApplyFilter}>
            
                {isLoading ? "Filtering..." : "Apply Filters"}
                </button>
            </div>
        </div>
    )
}

export default FilterRoomsForm