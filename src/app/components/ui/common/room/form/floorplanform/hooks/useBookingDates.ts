import { useState } from "react";

export const useBookingDates = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [bookedRooms, setBookedRooms] = useState<string[]>([]);

    const onChange = async (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            const res = await fetch("/api/room/booked", {
            method: "POST",
            body: JSON.stringify({ start, end }),
            });
            setBookedRooms(await res.json());
        }
    };

    return { startDate, endDate, bookedRooms, onChange }

}