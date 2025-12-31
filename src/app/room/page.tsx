import { Metadata } from "next";
import HeaderSection from "../components/layout/header/HeaderSection";
import Main from "../components/Main";
import { Suspense } from "react";
import RoomSkeleton from "../components/ui/skeletons/room/RoomSkeleton";

export const metadata: Metadata = {
  title: "Rooms & Rates",
  description: "Choose your best room today",
};

const RoomPage = () => {
  return (
    <div>
      <HeaderSection title="Rooms & Rates" subTitle="Lorem, ipsum dolor." />
      <div className="mt-10 px-4">
        <Suspense fallback={<RoomSkeleton />}>
          <Main />
        </Suspense>
      </div>
    </div>
  );
};

export default RoomPage;
