import RoomColorDescription from "@/app/components/ui/room/sketch/RoomColorDescription";
import { DatePicker } from "react-datepicker";
import SectionLabel from "./SectionLabel";

type Props = {
    startDate: Date | null;
    endDate: Date | null;
   onChange: (dates: [Date | null, Date | null]) => void;
};

const DateSection = ({startDate, endDate, onChange}: Props) => (
    <div className="flex flex-wrap sm:flex-row justify-center md:flex-col w-full sm:w-max px-5 sm:px-10 md:px-2 py-10 sm:justify-between sm:items-center gap-6">
    <div>
      <SectionLabel step={1} label="Choose Date" />
      <DatePicker
        selected={startDate}
        minDate={new Date()}
        onChange={onChange as (dates: [Date | null, Date | null]) => void}
        startDate={startDate}
        endDate={endDate}
        selectsRange selectsDisabledDaysInRange inline
      />
    </div>
    <div className="overflow-auto w-max">
      <p className="tracking-wider text-balance mb-2 text-center">Room Color Description</p>
      <div className="border-dashed border-2 bg-gray-100 border-gray-300 py-4 px-8 rounded-md">
        <RoomColorDescription />
      </div>
    </div>
  </div>
)

export default DateSection;