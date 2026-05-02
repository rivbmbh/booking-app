import { getRoomType, getRoomTypeOptions } from "@/lib/data";
import RoomContent from "../room/RoomContent";

const Main = async () => {
    const [rooms, roomTypeOptions] = await Promise.all([
        getRoomType(),
        getRoomTypeOptions(),
    ]);
  if (!rooms?.length) return <p>No Room Found</p>;

  return (
    <div className="max-w-screen-3xl mx-auto">
        <RoomContent rooms={rooms} roomTypeOptions={roomTypeOptions ?? []} />
    </div>
  );
};

export default Main;
