import { getRooms } from "@/lib/data";
import Card from "./ui/card/Card";

const Main = async () => {
  const rooms = await getRooms();
  if (!rooms?.length) return <p>No Room Found</p>;
  return (
    <div className="max-w-screen-2xl py-6 pb-20 px-4 mx-auto">
      <div className="grid gap-5 md:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Main;
