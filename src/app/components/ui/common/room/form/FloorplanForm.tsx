import { use, useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import RoomColorDescription from "../../../room/sketch/RoomColorDescription";
import FloorPlan2nd from "../../../room/sketch/floorplans/Floor2nd";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { formatCurrency } from "@/lib/utils";

type Props = {
    setRoomData: (data: string[]) => void;
    endDate?: Date | null;
    setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
};

const FloorplanForm = ({ setRoomData, endDate, setEndDate }: Props) => {
    const router = useRouter()
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    // const [endDate, setEndDate] = useState<Date | null>(null);
    const [bookedRooms, setBookedRooms] = useState<string[] | null>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [roomCache, setRoomCache] = useState<{ [key: string]: [] }>({})
    const [selectedRoomsData, setSelectedRoomsData] = useState<string[]>([])
    const [grandPrice, setGrandPrice] = useState("")
    const handleSelectedRoomsData = useCallback((rooms: string[]) => {
        setSelectedRoomsData(rooms)
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

    }, [selectedRoomsData])

    const onChange = async (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;

        setSelectedRoomsData([])// reset selected rooms when date change
        setStartDate(start);
        setEndDate(end);

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
                    <FloorPlan2nd endDate={endDate} resetTrigger={endDate} bookedRooms={bookedRooms ?? []} setSelectedRoomsData={handleSelectedRoomsData}/>
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