"use client";
import { createReserve } from "@/lib/action";
import { DisabledDateProps, RoomTypeDetailProps } from "@/types/room";
import clsx from "clsx";
import { addDays, isAfter, isEqual, subDays } from "date-fns";
import { useActionState, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReserveForm = ({
  roomType,
  disabledDate,
}: {
  roomType: RoomTypeDetailProps;
  disabledDate: DisabledDateProps[];
}) => {
  console.info(disabledDate)
  const StartDate = new Date();
  const EndDate = addDays(StartDate, 1); // satu hari setelah hari pertama (starDate)

  const [startDate, setStartDate] = useState(StartDate);
  const [endDate, setEndDate] = useState(EndDate);

  function handleStartDateChange(date: Date | null) {
    setStartDate(date ?? StartDate);

    //jika startDate >= endDate maka endDate akan diundur satu hari setelah startDate
    if (date! >= endDate) {
      setEndDate(addDays(date!, 1));
    }
  }
  function handleEndDateChange(date: Date | null) {
    setEndDate(date ?? EndDate);
  }

  const excludeDates = useMemo(
    () =>
      disabledDate.map((item) => ({
        start: new Date(item.startDate),
        end: subDays(new Date(item.endDate), 1),
      })),
    [disabledDate]
  );

  //Tanggal maksimal check-out berdasarkan booking/disabled date yang sudah ada
  function getMaxEndDate(
    startDate: Date,
    disabledDate: DisabledDateProps[]
  ): Date | null {
    const futureDisabled = disabledDate
      .map((item) => new Date(item.startDate))//ambil semua startDate dari disabled date.
      .filter((date) => isAfter(date, startDate) || isEqual(date, startDate))//ambil tanggal yang setelah check-in atau sama dengan check-in
      .sort((a, b) => a.getTime() - b.getTime());

    //batas maksimal berdasarkan aturan hotel
    const maxStayLimit = addDays(startDate, 7);//hanya bisa booking selama 1 minggu 
      if (futureDisabled.length === 0) {
      return maxStayLimit;
    }
   
    const nextBooking = subDays(futureDisabled[0], 1);

    // ambil tanggal yang lebih dekat
    return nextBooking < maxStayLimit ? nextBooking : maxStayLimit;
  }

  const maxEndDate = useMemo(
    () => getMaxEndDate(startDate, disabledDate),
    [startDate, disabledDate]
  );

  //action setelah button submit ditekan
  const [state, formAction, isPending] = useActionState(
    createReserve.bind(null, roomType.id, roomType.price, startDate, endDate),
    null
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
          {/* general message */}
          {state?.message ? (
            <div className="mb-4 bg-red-500 p-2 rounded-l-sm rounded-br-sm">
              <span className="text-sm text-gray-100">{state.message}</span>
            </div>
          ) : null}
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
