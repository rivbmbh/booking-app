import { getRoomType, getRoomTypeOptions } from "@/lib/data";
import RoomContent from "../room/RoomContent";

const Main = async () => {
    const [roomTypes, roomTypeOptions] = await Promise.all([
        getRoomType(),
        getRoomTypeOptions(),
    ]);
  if (!roomTypes?.length) return <p>No Room Found</p>;

  return (
    <div className="max-w-screen-3xl mx-auto">
        <RoomContent roomTypes={roomTypes} roomTypeOptions={roomTypeOptions ?? []} />
    </div>
  );
};

export default Main;
