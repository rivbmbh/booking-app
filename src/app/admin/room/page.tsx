import RoomTypeTable from "@/app/components/ui/common/room/RoomTypeTable";
import RoomTable from "@/app/components/ui/common/room/RoomTypeTable";
import Link from "next/link";
import React, { Suspense } from "react";

const RoomPage = () => {
  return (
    <div className="max-w-screen-2xl px-4 py-16 mt-10 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Room Type List</h1>
        <div className="flex gap-7 justify-between">
        <Link
          href={`/admin/room/create/roomtype`}
          className="bg-orange-400 px-6 py-2.5 hover:bg-orange-500 text-white font-semibold active:scale-105"
        >
          Add Room Type
        </Link>
        </div>
      </div>
      <Suspense fallback={<p>Loading data...</p>}>
        <RoomTypeTable />
      </Suspense>
    </div>
  );
};

export default RoomPage;
