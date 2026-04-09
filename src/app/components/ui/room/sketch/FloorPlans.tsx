import { useState } from "react";
import RoomColorDescription from "./RoomColorDescription";
import FloorPlan2nd from "./floorplans/Floor2nd";
import DatePicker from "react-datepicker";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { IoPricetags } from "react-icons/io5";
import RoomSidebar from "@/app/components/layout/sidebar/roomSidebar";
import "react-datepicker/dist/react-datepicker.css";


const FloorPlans = () => {
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)

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
      setBookedRooms(data)
      return data
    }
  }

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

      router.push(`/checkout/${data.bookingId}`)
      

    } catch (error) {
      alert(error.message)
    } finally{
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white max-w-screen-2xl w-full md:mx-auto rounded-lg">
        <div  className="flex flex-col md:flex-row gap-4 items-start justify-evenly w-full px-2">
          <div className="flex flex-wrap sm:flew-row justify-center md:flex-col w-full sm:w-max px-5 sm:px-10 md:px-2 py-10 sm:justify-between sm:items-center gap-6">
            <div className="">
              <p className="tracking-wider text-base mb-2">Choose Date</p>
                <DatePicker
                className="object-cover "
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
            </div>

            <div className="overflow-auto w-max ">
                <p className="tracking-wider text-balance mb-2">Room Color Description</p>
                <div className="border-dashed border-2 border-gray-300 py-4 px-7 rounded-md">
                  <RoomColorDescription/>
                </div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-lg min-[1170px]:w-max mt-5 p-10 md:ml-2 overflow-auto">
              <FloorPlan2nd bookedRooms={bookedRooms ?? []} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms}/>
          </div>
        </div>

        <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex"></div>
        <div className="px-8 pb-8 pt-4 flex flex-wrap justify-center sm:justify-between w-full">
          <div className="flex justify-between items-center text-md mb-4 sm:mb-0">
            <p className="font-semibold">Grand Total : </p>
            &nbsp;
            <p>Rp 1,000,000</p>
          </div>
          <button 
          type="submit" 
          className={clsx("px-6 w-52 py-2 bg-primary text-white rounded-md hover:bg-primary-hover", 
            {"opacity-50 cursor-progress": isLoading}
          )}
          disabled={isLoading}>
            {isLoading ? "Loading..." : "Booking Now"}
          </button>
        </div>
      </form>
      
      <button type="button" onClick={toggleSidebar} className={`cursor-pointer fixed right-0 top-32 bg-primary w-10 h-10 rounded-l-full flex justify-center items-center p-3 text-white transition-all ease-in-out duration-500 ${selectedRooms.length > 0 && !openSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0' }`}>
        <div className="relative">
          <IoPricetags className="size-5"/>
          <p className="w-5 h-5 absolute -top-6 -right-2.5 rounded-full bg-[#C8A755] text-white text-sm flex items-center justify-center">{selectedRooms.length}</p>
        </div>
      </button>
      <RoomSidebar openSidebar={openSidebar} toggleSidebar={toggleSidebar} selectedRooms={selectedRooms}/>
    </>
  );
};

export default FloorPlans;