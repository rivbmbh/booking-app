import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";

const FloorPlans = ({rooms}) => {
  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="overflow-auto mx-auto">
          <RoomColorDescription/>
      </div>
      <div className="overflow-auto h-screen mx-auto w-full lg:w-auto">
          <FloorPlan2nd/>
      </div>
    </div>
  );
};

export default FloorPlans;