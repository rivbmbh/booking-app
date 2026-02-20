
import RoomTypeTable from "@/app/components/ui/common/room/table/RoomTypeTable";
import Link from "next/link";
import { Suspense } from "react";

const RoomTypePage = () => {
  return (
    <div className="max-w-screen-2xl px-4 py-16 mt-10 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Room Type List</h1>
        <div className="flex gap-7 justify-between">
        <Link
          href={`/admin/roomtype/create/`}
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

export default RoomTypePage;
