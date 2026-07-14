import DashBoardCards from "@/app/components/ui/common/admin/DashboardCards";
import ReservationList from "@/app/components/ui/common/admin/ReservationList";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

type Props = {
  searchParams: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    floor?: string;
    roomTypeId?: string;
  };
};

const DashboardPage = async ({searchParams}: Props) => {
  return (
    <div className="max-w-screen-2xl px-4 py-16 mt-10 mx-auto">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DashBoardCards />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <ReservationList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
