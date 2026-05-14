import Swal from "sweetalert2";
import BookingSummary from "./components/BookingSummary";
import DateSection from "./components/DateSection";
import RoomSection from "./components/RoomSection";
import { useState } from "react";
import { useBookingDates } from "./hooks/useBookingDates";
import { useRoomSelection } from "./hooks/useRoomSelection";
import { RoomTypeOptionsProps, RoomWithDetailsProps } from "@/types/room";
import { useRouter } from "next/navigation";

type Props = {
    setRoomData: (data: RoomWithDetailsProps[]) => void;
    endDate?: Date | null;
    setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
    roomTypeOptions: RoomTypeOptionsProps[];
};

const FloorplanForm = ({ setRoomData, roomTypeOptions }: Props) => {
  const router = useRouter();
  const { startDate, endDate, bookedRooms, onChange } = useBookingDates();
  const { selectedRooms, setSelectedRooms, grandPrice } = useRoomSelection(setRoomData);
  const [filterData, setFilterData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return Swal.fire({ icon: "warning", title: "Invalid Date!", text: "Please select a valid date range" });
    if (!selectedRooms.length) return Swal.fire({ icon: "warning", title: "No Rooms Selected!", text: "Please select at least 1 room" });

    try {
      setIsLoading(true);
      const res = await fetch("/api/room/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, roomIds: selectedRooms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      router.push(`/checkout/${data.bookingId}`);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error instanceof Error ? error.message : "Failed to filter rooms" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white max-w-screen-2xl pt-4 w-full md:mx-auto rounded-lg">
      <div className="flex flex-col md:flex-row items-start justify-evenly w-full px-2">
        <DateSection startDate={startDate} endDate={endDate} onChange={onChange} />
        <RoomSection
          endDate={endDate} bookedRooms={bookedRooms} roomTypeOptions={roomTypeOptions}
          filterData={filterData} onFilterChange={setFilterData} onRoomSelect={setSelectedRooms}
        />
      </div>
      <div className="w-full mx-auto h-0.5 bg-gray-200" />
      <BookingSummary grandPrice={grandPrice} isLoading={isLoading} />
    </form>
  );
};

export default FloorplanForm;