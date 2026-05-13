"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { RoomTypeOptionsProps } from "@/types/room";

type Props = {
  roomTypeOptions: RoomTypeOptionsProps[];
};

const SearchFilterBar = ({ roomTypeOptions }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  // Debounce search agar tidak trigger setiap ketikan
  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams("search", value);
  }, 400);

  return (
    <div className="flex justify-start mb-5 gap-4 mt-2">
      <input
        type="search"
        name="findByRoomNumber"
        placeholder="room number.."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 rounded-md py-2 px-2 tracking-wider font-normal focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-500 placeholder:uppercase text-sm"
      />
      <select
        name="floorPlans"
        defaultValue={searchParams.get("floor") ?? "all"}
        onChange={(e) => updateParams("floor", e.target.value)}
        className="border border-gray-300 rounded-md py-2 px-2 tracking-wider font-normal focus:outline-none focus:ring-2 focus:ring-primary text-gray-500 uppercase text-sm"
      >
        <option value="all">All Floors</option>
        <option value="1">Floor 1</option>
        <option value="2">Floor 2</option>
        <option value="3">Floor 3</option>
      </select>
      <select
        name="roomTypes"
        defaultValue={searchParams.get("roomTypeId") ?? "all"}
        onChange={(e) => updateParams("roomTypeId", e.target.value)}
        className="border border-gray-300 rounded-md py-2 px-2 tracking-wider font-normal focus:outline-none focus:ring-2 focus:ring-primary text-gray-500 uppercase text-sm"
      >
        <option value="all">All Room Types</option>
        {roomTypeOptions.map((roomType) => (
          <option key={roomType.id} value={roomType.id}>
            {roomType.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;