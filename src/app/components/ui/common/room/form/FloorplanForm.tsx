import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import RoomColorDescription from "../../../room/sketch/RoomColorDescription";
import FloorPlan2nd from "../../../room/sketch/floorplans/Floor2nd";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { formatCurrency } from "@/lib/utils";
import FilterRoomsForm from "./FilterRoomsForm";
import { RoomTypeOptionsProps } from "@/types/room";

type Props = {
    setRoomData: (data: string[]) => void;
    endDate?: Date | null;
    setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
};

const FloorplanForm = ({ setRoomData, endDate, setEndDate, roomTypeOptions, bedTypeOptions }: Props & { roomTypeOptions: RoomTypeOptionsProps[], bedTypeOptions: string[] }) => {
    const router = useRouter()
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [roomCache, setRoomCache] = useState<{ [key: string]: [] }>({})
    const [selectedRoomsData, setSelectedRoomsData] = useState<string[]>([])
    const [grandPrice, setGrandPrice] = useState("")
    const handleSelectedRoomsData = useCallback((rooms: string[]) => {
        setSelectedRoomsData(rooms)
    }, [])

    const [filterData, setFilterData] = useState<string[]>([])
    console.info("filterData", filterData)
    const handleFilterChange = useCallback((data: string[]) => {
        setFilterData(data)
    }, [])

    useEffect(() => {
    let totalPrice = 0
    selectedRoomsData.forEach((room) => {
        const roomNumber = room.replace("room-", "")
        const roomInfo = roomCache[roomNumber]
        if (roomInfo) {
        totalPrice += roomInfo.RoomType.price // ✅ Fix bug 1
        }
    })

    setGrandPrice(formatCurrency(totalPrice))
    }, [selectedRoomsData, roomCache]) // ✅ tambah roomCache sebagai dependency

    useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        const getDataSelectedRooms = async () => {
        try {
            if (!selectedRoomsData || selectedRoomsData.length === 0) return;
            if (!selectedRoomsData || selectedRoomsData.length === 0) {
                setRoomData([]);
                return;
            }
            const roomNumbers = selectedRoomsData.map((room) => room.replace("room-", ""))
            const res = await fetch("/api/room/selected", {
                method: "POST",
                headers:{
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomNumbers }),
                signal: controller.signal
            })
    
            const data = await res.json()
            const newRooms = data.filter((room: { roomNumber: string }) => !roomCache[room.roomNumber])

            setRoomCache((prev) => {
                const newCache = { ...prev }
                newRooms.forEach((room: { roomNumber: string }) => {
                newCache[room.roomNumber] = room
                })
                return newCache
            })
            setRoomData(data);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err)
            }
        }
        }
        getDataSelectedRooms()
    }, 300)

    return () => {
        clearTimeout(timeout)
        controller.abort()
    }

    }, [selectedRoomsData, setRoomData, roomCache])

    const onChange = async (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;

        setSelectedRoomsData([])// reset selected rooms when date change
        setStartDate(start);
        setEndDate!(end);

        if (start && end) {
            const res = await fetch("/api/room/booked", {
            method: "POST",
            body: JSON.stringify({ start, end })
            });

            const data = await res.json();
            setBookedRooms(data)
            // return data
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!startDate || !endDate){
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Date!',
            text: 'Please select a valid date range',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
        });
        return
    }

    if(!selectedRoomsData || selectedRoomsData.length === 0){
        Swal.fire({
            icon: 'warning',
            title: 'No Rooms Selected!',
            text: 'Please select at least 1 room',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
        });
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
            roomIds: selectedRoomsData
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

    return (
        <form onSubmit={handleSubmit} className="bg-white max-w-screen-2xl pt-4 w-full md:mx-auto rounded-lg">
            <div  className="flex flex-col md:flex-row items-start justify-evenly w-full px-2">
                <div className="flex flex-wrap sm:flew-row justify-center md:flex-col w-full sm:w-max px-5 sm:px-10 md:px-2 py-10 sm:justify-between sm:items-center gap-6">
                    <div className="">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="rounded-full bg-primary w-7 h-7 text-center font-semibold text-white border-2 border-black">1</p>
                            <p className="tracking-wider text-base font-semibold">Choose Date</p>
                        </div>
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
                    </div>

                    <div className="overflow-auto w-max ">
                        <p className="tracking-wider text-balance mb-2 text-center">Room Color Description</p>
                        <div className="border-dashed border-2 bg-gray-100  border-gray-300 py-4 px-8 rounded-md">
                            <RoomColorDescription/>
                        </div>
                    </div>
                </div>
                
                <div className="w-full min-[1170px]:w-max md:ml-2 overflow-auto px-2 pt-2 mt-8">
                    <h5 className="mb-1.5">Filter Rooms : </h5>
                    <FilterRoomsForm roomTypeOptions={roomTypeOptions} bedTypeOptions={bedTypeOptions} onFilterChange={handleFilterChange} />
                    <div className="flex items-center gap-2 mb-2 mt-6">
                        <p className="rounded-full bg-primary w-7 h-7 text-center font-semibold text-white border-2 border-black">2</p>
                        <p className="tracking-wider text-base font-semibold">Choose Room</p>
                    </div>
                    <div className="w-full border border-gray-300 p-7 rounded-sm overflow-auto">
                        <FloorPlan2nd endDate={endDate} resetTrigger={endDate} bookedRooms={bookedRooms ?? []} filteredRooms={filterData} setSelectedRoomsData={handleSelectedRoomsData}/>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex"></div>

            <div className="px-8 pb-8 pt-4 flex flex-wrap justify-center sm:justify-between w-full">
                <div className="flex justify-between items-center text-md mb-4 sm:mb-0">
                    <p className="font-semibold">Grand Total : </p>
                    &nbsp;
                    <p>{grandPrice || "Rp 0"}</p>
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
    )
}

export default FloorplanForm