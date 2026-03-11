import { useState } from "react";
import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);
  console.info(bookedRooms)
  const onChange = async (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const res = await fetch("/api/room/booked", {
        method: "POST",
        body: JSON.stringify({ start, end })
      });

      const data = await res.json();
      setBookedRooms(data)
      return data
    }
  };

  return (
    <>
    <div className="flex flex-wrap gap-4 items-start justify-center w-full h-max">
      <div className="flex flex-col gap-8 justify-between">
        <div className="overflow-auto mx-auto mt-2">
            <RoomColorDescription/>
        </div>
        <div className="w-auto mx-auto">
          <p className="text-center font-semibold my-4 text-md">Pilih tanggal menginap</p>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
            />
            <div className="w-full flex justify-center my-4">
              <button className="bg-blue-500 w-[85%] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pesan Sekarang</button>
              </div>
            </div>
      </div>
      <div className="w-full min-[1170px]:w-auto bg-old-paper rounded-md mx-auto py-10 overflow-auto scale-85 md:scale-90 lg:scale-100 2xl:scale-none">
          <FloorPlan2nd bookedRooms={bookedRooms ?? []}/>
      </div>
    </div>
    </>
  );
};

export default FloorPlans;