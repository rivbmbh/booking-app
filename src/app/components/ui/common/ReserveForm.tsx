"use client";
import { createReserve } from "@/lib/action";
import { DisabledDateProps, RoomDetailProps } from "@/types/room";
import clsx from "clsx";
import { addDays } from "date-fns";
import { useActionState, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReserveForm = ({
  room,
  disabledDate,
}: {
  room: RoomDetailProps;
  disabledDate: DisabledDateProps[];
}) => {
  const StartDate = new Date();
  const EndDate = addDays(StartDate, 1); // satu hari setelah hari pertama

  const [startDate, setStartDate] = useState(StartDate);
  const [endDate, setEndDate] = useState(EndDate);

  function handleDateChange(dates: any) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }

  const [state, formAction, isPending] = useActionState(
    createReserve.bind(null, room.id, room.price, startDate, endDate),
    null
  );

  // console.info(disabledDate);
  const excludeDates = disabledDate.map((item) => {
    return {
      start: item.startDate,
      end: item.endDate,
    };
  });

  return (
    <div>
      <form action={formAction}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 capitalize">
            Arrival - Deparature
          </label>
          <DatePicker
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            selectsRange={true}
            onChange={handleDateChange}
            excludeDateIntervals={excludeDates}
            dateFormat={"dd-MM-YYYY"}
            wrapperClassName="w-full"
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
          />
          <div aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 capitalize">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
            placeholder="Full name"
          />
          <div aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500 mt-2">{state?.error?.name}</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 capitalize">
            Phone Number
          </label>
          <input
            type="number"
            name="phone"
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
            placeholder="ex: 081003234543"
          />
          <div aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500 mt-2">{state?.error?.phone}</p>
          </div>
        </div>
        <button
          type="submit"
          className={clsx(
            "px-10 py-3 text-center font-semibold text-white w-full bg-orange-400 rounded-sm cursor-pointer hover:bg-orange-500",
            {
              "opacity-50 cursor-progress": isPending,
            }
          )}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Reserve"}
        </button>
      </form>
    </div>
  );
};

export default ReserveForm;
