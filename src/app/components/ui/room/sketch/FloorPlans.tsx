import RoomSidebar from "@/app/components/layout/sidebar/RoomSidebar";
import FloorplanForm from "../../common/room/form/FloorplanForm";
import { startTransition, useCallback, useEffect, useState } from "react";
import { RoomTypeOptionsProps } from "@/types/room";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = ({ roomTypeOptions }: { roomTypeOptions: RoomTypeOptionsProps[] }) => {
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
      <FloorplanForm setRoomData={handleChangeRoomData} endDate={endDateForReset} setEndDate={setEndDateForReset} roomTypeOptions={roomTypeOptions} />   
      <RoomSidebar roomData={roomData} />
    </>
  );
};

export default FloorPlans;