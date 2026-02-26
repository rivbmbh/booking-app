"use client";
import { createReserve } from "@/lib/action";
import { DisabledDateProps, RoomDetailProps } from "@/types/room";
import clsx from "clsx";
import { addDays, isAfter, isEqual, subDays } from "date-fns";
import { useActionState, useMemo, useState } from "react";
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

  function handleStartDateChange(date: Date | null) {
    setStartDate(date ?? StartDate);

    //pastikan tanggal check-out setelah tanggal check-in
    if (date! >= endDate) {
      setEndDate(addDays(date!, 1));
    }
  }
  function handleEndDateChange(date: Date | null) {
    setEndDate(date ?? EndDate);
  }

  const [state, formAction, isPending] = useActionState(
    createReserve.bind(null, room.id, room.RoomType?.price, startDate, endDate),
    null
  );

  // console.info(disabledDate);
  const excludeDates = useMemo(
    () =>
      disabledDate.map((item) => ({
        start: item.startDate,
        end: item.endDate,
      })),
    [disabledDate]
  );

  function getMaxEndDate(
    startDate: Date,
    disabledDate: DisabledDateProps[]
  ): Date | null {
    const futureDisabled = disabledDate
      .map((item) => new Date(item.startDate))
      .filter((date) => isAfter(date, startDate) || isEqual(date, startDate))
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureDisabled.length === 0) return null;

    // maksimal check-out = 1 hari sebelum disabled date terdekat
    return subDays(futureDisabled[0], 1);
  }

  const maxEndDate = useMemo(
    () => getMaxEndDate(startDate, disabledDate),
    [startDate, disabledDate]
  );

  return (
    <div>
      <form action={formAction}>
        {/* input date */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="mb-4 w-max">
            <label className="block mb-2 text-sm font-semibold text-gray-900 capitalize text-center">
              Arrival
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              excludeDateIntervals={excludeDates}
              dateFormat={"dd-MM-YYYY"}
              inline
              wrapperClassName="w-full"
              className="py-2 px-4 rounded-md border border-gray-300 w-full"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
            </div>
          </div>
          <div className="mb-4 w-max">
            <label className="block mb-2 text-sm font-semibold text-center text-gray-900 capitalize">
              Departure
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={addDays(startDate, 1)}
              maxDate={maxEndDate ?? undefined}
              excludeDateIntervals={excludeDates}
              dateFormat={"dd-MM-YYYY"}
              inline
              wrapperClassName="w-full"
              className="py-2 px-4 rounded-md border border-gray-300 w-full"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
            </div>
          </div>
        </div>
        {/* end input date */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 capitalize">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            className="py-2 px-4 rounded-md border bg-white border-gray-300 w-full"
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
            className="py-2 px-4 rounded-md border border-gray-300 bg-white w-full"
            placeholder="ex: 081003234543"
          />
          <div aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500 mt-2">{state?.error?.phone}</p>
          </div>
        </div>
        <button
          type="submit"
          className={clsx(
            "px-10 py-3 text-center font-semibold text-white w-full bg-primary rounded-sm cursor-pointer hover:bg-primary-hover",
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
