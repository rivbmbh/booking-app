import { useActionState, useState } from "react";
import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createReserve } from "@/lib/action";


const FloorPlans = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);

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

  // const [state, formAction, isPending] = useActionState(
  //     createManyReserve.bind(null, startDate, endDate),
  //     null
  //   );

  return (
    <form className="flex flex-wrap gap-4 items-start justify-center w-full h-max">
      <div className="flex flex-col gap-8 justify-between">
        <div className="overflow-auto mx-auto mt-2">
            <RoomColorDescription/>
        </div>
        <div className="w-auto mx-auto">
          <p className="text-center font-semibold my-4 text-md">Select your stay date</p>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              // maxDate={startDate ? new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000) : undefined}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
            />
            {/* <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
            </div> */}
            <div className="w-full flex justify-center my-4">
              <button className="px-6 w-60 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Booking Now</button>
            </div>
        </div>
      </div>
      <div className="w-full min-[1170px]:w-auto bg-old-paper rounded-md mx-auto py-10 overflow-auto scale-85 md:scale-90 lg:scale-100 2xl:scale-none">
          <FloorPlan2nd bookedRooms={bookedRooms ?? []}/>
      </div>
    </form>
  );
};

export default FloorPlans;