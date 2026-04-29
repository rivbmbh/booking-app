import { getBedType, getRoomType, getRoomTypeOptions } from "@/lib/data";
import RoomContent from "../room/RoomContent";

const Main = async () => {
    const [rooms, roomTypeOptions, bedTypeOptions] = await Promise.all([
        getRoomType(),
        getRoomTypeOptions(),
        getBedType()
    ]);
  if (!rooms?.length) return <p>No Room Found</p>;

  console.info("roomTypeOptions", roomTypeOptions)
  return (
    <div className="max-w-screen-3xl mx-auto">
       <RoomContent rooms={rooms} roomTypeOptions={roomTypeOptions} bedTypeOptions={bedTypeOptions}/>
    </div>
  );
};

export default Main;
