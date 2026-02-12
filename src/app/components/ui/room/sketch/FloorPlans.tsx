import { useState } from "react";
import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

type TExcludeDate =
  | Array<{
      date: Date;
      message?: string;
    }>
  | Array<Date>;

const FloorPlans = ({rooms}) => {
  console.info(rooms);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const excludeDates: TExcludeDate = [
    addDays(new Date(), 1),//besok
    addDays(new Date(), 5),//hari ke 5 dari sekarang
    addDays(new Date(), 6),//hari ke 6 dari sekarang
    addDays(new Date(), 10),//hari ke 10 dari sekarang
  ];

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
              excludeDates={excludeDates}
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
          <FloorPlan2nd/>
      </div>
    </div>
    </>
  );
};

export default FloorPlans;