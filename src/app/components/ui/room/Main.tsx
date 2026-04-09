import { getRoomType } from "@/lib/data";
import RoomContent from "../room/RoomContent";

const Main = async () => {
  const rooms = await getRoomType();
  if (!rooms?.length) return <p>No Room Found</p>;

  return (
    <div className="max-w-screen-3xl mx-auto">
       <RoomContent rooms={rooms}/>
    </div>
  );
};

export default Main;
