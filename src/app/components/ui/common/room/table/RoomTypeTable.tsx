import { getRoomType } from "@/lib/data";
import RoomTypeTableClient from "./RoomTypeTableClient";


const RoomTypeTable = async () => {
  const roomType = await getRoomType();
  if (!roomType?.length) return <p>No Room Type Found</p>;
  return (
    <RoomTypeTableClient data={roomType} />
  );
};

export default RoomTypeTable;
