"use client";
import { saveRoom } from "@/lib/action";
import { RoomTypeDetailProps } from "@/types/room";
import clsx from "clsx";
import { useActionState, useEffect, useRef, useState } from "react";


const CreateRoomForm = ({roomType}: {roomType: RoomTypeDetailProps[]}) => {
  const [state, formAction, isPending] = useActionState(
    saveRoom.bind(null),
    null
  );

  const [selectedFloor, setSelectedFloor] = useState(null); 
  const roomRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
  if (!roomRef.current || !selectedFloor) return;

  const map = {
    "2nd": 200,
    "3rd": 300,
    "4th": 400,
  };

  const base = map[selectedFloor];

  roomRef.current.min = base;
  roomRef.current.max = base + 99;

  roomRef.current.placeholder = `Start from ${base}`;

  // clear previous error
  roomRef.current.setCustomValidity("");
}, [selectedFloor]);

const validateRoom = (e) => {
  if (!selectedFloor) return;

  const value = Number(e.target.value);
  const firstDigit = Math.floor(value / 100);

  const map = { "2nd": 2, "3rd": 3, "4th": 4 };

  if (firstDigit !== map[selectedFloor]) {
    e.target.setCustomValidity(
      `Room number must start with ${map[selectedFloor]}`
    );
  } else {
    e.target.setCustomValidity("");
  }
};
  return (
    <form action={formAction}>
      <div className="flex justify-start  w-full max-w-screen-2xl">
        <div className="w-4/6 bg-white p-4">
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-600 mb-1">Floor</p>
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {["2nd","3rd","4th"].map((floor) => (
                <label key={floor} className="cursor-pointer">
                  <input type="radio" name="floor" value={floor} className="peer hidden" onChange={(e) => setSelectedFloor(e.target.value)}/>
                  <div className="px-5 py-2 rounded-md text-sm font-medium
                  text-gray-600
                  peer-checked:bg-primary 
                  peer-checked:text-white
                  peer-checked:font-semibold
                  peer-checked:shadow
                  transition-all">
                    {floor}
                  </div>
                </label>
                ))}
            </div>
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.status}
              </span>
            </div>
          </div>

          <div className="mb-4">
          <div className="relative">

            {/* Prefix floor indicator */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              #
            </div>

            <input
              ref={roomRef}
              type="number"
              name="roomNumber"
              placeholder=""
              onInput={validateRoom}
              className={`peer w-full py-2.5 pl-8 pr-4 rounded-lg border bg-white outline-none transition-all
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              ${state?.error?.roomNumber
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}
              `}
              required
            />

            {/* Floating label */}
            <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-gray-500
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-gray-400
              peer-focus:-top-2.5
              peer-focus:text-xs
              peer-focus:text-blue-600
              transition-all">
              {/* Room Number (ex: 201 = 2nd floor) */}
              {selectedFloor
              ? `Rooms Number (ex: ${selectedFloor[0]}01 = ${selectedFloor} floor)`
              : "Select floor first"}
            </label>
          </div>

          {/* Error message */}
          <div aria-live="polite" aria-atomic="true">
            <span className="text-sm text-red-500 mt-2 block">
              {state?.error?.roomNumber}
            </span>
          </div>
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Room Type
            </label>

            <div className="relative">
              <select
                name="bedType"
                defaultValue=""
                className={`appearance-none w-full py-2.5 px-4 pr-10 rounded-lg border bg-white
                transition-all outline-none
                ${state?.error?.roomType
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}
                text-gray-700 invalid:text-gray-400`}
                required
              >
                <option value="" disabled hidden>
                  Choose Room Type
                </option>

                {roomType.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>

              {/* Arrow icon */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            {/* Error message */}
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2 block">
                {state?.error?.roomType}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-600 mb-1">Status</p>
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {["AVAILABLE","BOOKED","MAINTENANCE"].map((status) => (
                <label key={status} className="cursor-pointer">
                  <input type="radio" name="status" value={status} className="peer hidden" />
                  <div className="px-5 py-2 rounded-md text-sm font-medium
                  text-gray-600
                  peer-checked:bg-primary 
                  peer-checked:text-white
                  peer-checked:font-semibold
                  peer-checked:shadow
                  transition-all">
                    {status}
                  </div>
                </label>
                ))}
            </div>
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.status}
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            className={clsx(
              "mt-10 bg-primary text-white w-full hover:bg-primary-hover py-2.5 px-6 md:px-1 text-lg font-semibold cursor-pointer",
              {
                "opacity-50 cursor-progress": isPending,
              }
            )}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateRoomForm;
