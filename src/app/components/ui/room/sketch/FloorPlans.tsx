import RoomSidebar from "@/app/components/layout/sidebar/RoomSidebar";
import FloorplanForm from "../../common/room/form/FloorplanForm";
import { startTransition, useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = () => {
  const [roomData, setRoomData] = useState<string[]>([])
  const [endDateForReset, setEndDateForReset] = useState<Date | null>(null)

  const handleChangeRoomData = useCallback((data: string[]) => {
    setRoomData(data)
  }, [])

  useEffect(() => {
    startTransition(() => {
      setRoomData([]);
    });
  }, [endDateForReset]);
  
  return (
    <>
      <FloorplanForm setRoomData={handleChangeRoomData} endDate={endDateForReset} setEndDate={setEndDateForReset}/>   
      <RoomSidebar roomData={roomData} />
    </>
  );
};

export default FloorPlans;