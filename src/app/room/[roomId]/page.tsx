import RoomDetailUser from "@/app/components/ui/common/room/RoomDetailUser";
import RoomDetailUserSkeleton from "@/app/components/ui/skeletons/room/RoomDetailUserSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

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
      <Suspense fallback={<RoomDetailUserSkeleton />}>
        <RoomDetailUser roomId={roomId} />
      </Suspense>
    </div>
  );
};

export default RoomDetailUserPage;
