import RoomDetailUser from "@/app/components/ui/common/room/RoomDetailUser";
import RoomSkeleton from "@/app/components/ui/skeletons/RoomSkeleton";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Room Detail",
};

const RoomDetailUserPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const roomId = (await params).roomId;
  return (
    <div className="mt-16">
      <Suspense fallback={<p>Loading...</p>}>
        <RoomDetailUser roomId={roomId} />
      </Suspense>
    </div>
  );
};

export default RoomDetailUserPage;
