import RoomSidebar from "@/app/components/layout/sidebar/RoomSidebar";
import FloorplanForm from "../../common/room/form/FloorplanForm";
import { useCallback, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = () => {
  const [roomData, setRoomData] = useState<string[]>([])

  const handleChangeRoomData = useCallback((data: string[]) => {
    setRoomData(data)
  }, [])


  return (
    <>
      <FloorplanForm setRoomData={handleChangeRoomData} />   
      <RoomSidebar roomData={roomData} />
    </>
  );
};

export default FloorPlans;