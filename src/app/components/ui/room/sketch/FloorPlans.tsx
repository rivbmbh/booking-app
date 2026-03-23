import { useState } from "react";
import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";
import DatePicker from "react-datepicker";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = () => {
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  console.log(bookedRooms)

  const onChange = async (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const res = await fetch("/api/room/booked", {
        method: "POST",
        body: JSON.stringify({ start, end })
      });

      const data = await res.json();
      console.info(data)
      setBookedRooms(data)
      return data
    }
  };



  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if(!startDate || !endDate){
      alert("Please select date first")
      return
    }

    if(!selectedRooms || selectedRooms.length === 0){
      alert("Please select at least 1 room")
      return
    }

    try {
      setIsLoading(true)

      const res = await fetch("/api/room/booking", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          roomIds: selectedRooms
        })
      })

      const data = await res.json()

      if(!res.ok){
        throw new Error(data.message || "Something went wrong")
      }

      router.push(`/checkout/booking/${data.bookingId}`)
      

    } catch (error) {
      alert(error.message)
    } finally{
      setIsLoading(false)
    }
  }

 

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-start justify-center w-full h-max">
      <div className="flex flex-col gap-8 justify-between">
        <div className="overflow-auto mx-auto mt-2">
            <RoomColorDescription/>
        </div>
        <div className="w-auto mx-auto">
          <p className="text-center font-semibold my-4 text-md">Select your stay date</p>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              // maxDate={startDate ? new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000) : undefined}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
            />
            {/* <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
            </div> */}
            <div className="w-full flex justify-center my-4">
              <button 
              type="submit" 
              className={clsx("px-6 w-60 py-2 bg-primary text-white rounded-md hover:bg-primary-hover", 
                {"opacity-50 cursor-progress": isLoading}
              )}
              disabled={isLoading}>
                {isLoading ? "Loading..." : "Booking Now"}
              </button>
            </div>
        </div>
      </div>
      <div className="w-full min-[1170px]:w-auto bg-old-paper rounded-md mx-auto py-10 overflow-auto scale-85 md:scale-90 lg:scale-100 2xl:scale-none">
          <FloorPlan2nd bookedRooms={bookedRooms ?? []} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms}/>
      </div>
    </form>
  );
};

export default FloorPlans;