import RoomSidebar from "@/app/components/layout/sidebar/RoomSidebar";
import { useCallback, useState } from "react";
import { RoomTypeOptionsProps, RoomWithDetailsProps } from "@/types/room";
import FloorplanForm from "../../common/room/form/floorplanform";


const FloorPlans = ({ roomTypeOptions }: { roomTypeOptions: RoomTypeOptionsProps[] }) => {
  const [roomData, setRoomData] = useState<RoomWithDetailsProps[]>([])

  const handleChangeRoomData = useCallback((data: RoomWithDetailsProps[]) => {
    setRoomData(data)
  }, [])
 
  return (
    <>
      {/* <FloorplanForm setRoomData={handleChangeRoomData} endDate={endDateForReset} setEndDate={setEndDateForReset} roomTypeOptions={roomTypeOptions} />    */}
      <FloorplanForm setRoomData={handleChangeRoomData} roomTypeOptions={roomTypeOptions} />
      <RoomSidebar roomData={roomData} />
    </>
  );
};

export default FloorPlans;