"use client"

import { useState } from "react";
import Card from "../card/Card";
import FloorPlans from "./sketch/FloorPlans";
import { RoomTypeProps } from "@/types/room";

const RoomContent = ({rooms}: {rooms: RoomTypeProps[]}) => {
  const [view, setView] = useState("floorplan")
  return (
   <>
    <div className="flex mb-10">
     <button
          onClick={() => setView("card")}
          className={`px-4 py-2 rounded ${
            view === "card" ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          Card
        </button>

        <button
          onClick={() => setView("floorplan")}
          className={`px-4 py-2 rounded ${
            view === "floorplan" ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          Floor Plan
        </button>
    </div>


    {view == "card" && (
        <div className="grid gap-5 md:grid-cols-3">
            {rooms.map((room) => (
                <Card key={room.id} roomType={room}/>
            ))}
        </div>
    )}

    {view == "floorplan" && <FloorPlans />}
   </>
  );
};

export default RoomContent;
