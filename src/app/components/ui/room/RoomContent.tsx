"use client"

import { useState } from "react";
import Card from "../card/Card";
import FloorPlans from "./sketch/FloorPlans";
import { RoomProps } from "@/types/room";

const RoomContent = ({rooms}: {rooms: RoomProps}) => {
  // console.info(rooms)
    const [view, setView] = useState("denah")
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
          onClick={() => setView("denah")}
          className={`px-4 py-2 rounded ${
            view === "denah" ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          Floor Plan
        </button>
    </div>


    {view == "card" && (
        <div className="grid gap-5 md:grid-cols-3">
            {rooms.map((room: RoomProps) => (
                <Card key={room.id} room={room}/>
            ))}
        </div>
    )}

    {view == "denah" && <FloorPlans rooms={rooms}/>}
   </>
  );
};

export default RoomContent;
