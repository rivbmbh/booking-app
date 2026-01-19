import RoomTable from "@/app/components/ui/common/room/roomTable";
import Link from "next/link";
import React, { Suspense } from "react";

const RoomPage = () => {
  return (
    <div className="max-w-screen-2xl px-4 py-16 mt-10 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Room List</h1>
        <Link
          href={`/admin/room/create`}
          className="bg-orange-400 px-6 py-2.5 hover:bg-orange-500 text-white font-semibold active:scale-105"
        >
          Create New
        </Link>
      </div>
      <Suspense fallback={<p>Loading data...</p>}>
        <RoomTable />
      </Suspense>
    </div>
  );
};

export default RoomPage;
