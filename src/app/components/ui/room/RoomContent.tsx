"use client"

import { useState } from "react";
import Card from "../card/Card";
import FloorPlans from "./floorplans/FloorPlans";
import { RoomTypeOptionsProps, RoomTypeProps } from "@/types/room";
import { RoomStatus } from "@prisma/client";

const RoomContent = ({roomTypes, roomTypeOptions}: {roomTypes: RoomTypeProps[], roomTypeOptions: RoomTypeOptionsProps[]}) => {
  const [view, setView] = useState("card")
  const availableRooms = roomTypes.filter((room) =>
  room.rooms.some((r) => r.status === RoomStatus.ACTIVE)
)
  return (
   <>
   {/* toogle view */}
    <div className="flex md:ml-7 mb-4 justify-center sm:justify-start">
        <button
          onClick={() => setView("card")}
          className={`px-4 py-2 rounded-l-lg text-lg transition-all ease-in-out duration-300 w-full min-[556px]:w-36 ${
            view === "card" ? "bg-primary text-white" : "bg-transparent"
          }`}
          >
          Card
        </button>
        <button
          onClick={() => setView("floorplan")}
          className={`px-4 py-2 rounded-r-lg text-lg transition-all ease-in-out duration-300 w-full min-[556px]:w-36 ${
            view === "floorplan" ? "bg-primary text-white" : "bg-transparent"
          }`}
          >
          Floor Plan
        </button>
    </div>

    {view == "card" && (
      <div className="grid gap-5 md:grid-cols-3 px-8 pb-8 pt-4">
          {availableRooms.length > 0 ? (
            availableRooms.map((room) => (
              <Card key={room.id} roomType={room} />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">No rooms available</p>
          )}
      </div>
    )}
    <div className="px-0 pt-3 pb-5 md:px-8 md:pb-8 md:pt-4">
      {view == "floorplan" && <FloorPlans roomTypeOptions={roomTypeOptions} />}
    </div>
   </>
  );
};

export default RoomContent;
