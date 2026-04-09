"use client"

import { useState } from "react";
import Card from "../card/Card";
import FloorPlans from "./sketch/FloorPlans";
import { RoomTypeProps } from "@/types/room";

const RoomContent = ({rooms}: {rooms: RoomTypeProps[]}) => {
  const [view, setView] = useState("floorplan")
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
          {rooms.map((room) => (
              <Card key={room.id} roomType={room}/>
          ))}
      </div>
    )}
    <div className="px-0 pt-3 pb-5 md:px-8 md:pb-8 md:pt-4">
      {view == "floorplan" && <FloorPlans />}
    </div>
   </>
  );
};

export default RoomContent;
