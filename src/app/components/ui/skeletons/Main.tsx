import { getRooms } from "@/lib/data";
import Card from "../card/Card";
import RoomContent from "../room/RoomContent";

const Main = async () => {
  const rooms = await getRooms();
  if (!rooms?.length) return <p>No Room Found</p>;

  return (
    <div className="max-w-screen-2xl py-6 pb-20 px-4 mx-auto">
       <RoomContent rooms={rooms}/>
    </div>
  );
};

export default Main;
