import { RefObject, useEffect, useRef } from "react";
import Swal from "sweetalert2";

type Props = {
    containerRef: RefObject<HTMLDivElement> | null;
    endDate: Date | null | undefined;
    bookedRoomsRef: React.MutableRefObject<string[]>;
    setSelectedRooms: React.Dispatch<React.SetStateAction<string[]>>;
    applyStyles: () => void;
}; 

export const useRoomClick = ({ containerRef, endDate, bookedRoomsRef, setSelectedRooms, applyStyles }: Props) => {
    const selectedDateRef = useRef<Date | null>(endDate ?? null);
    const selectedRoomsRef = useRef<string[]>([]);

    useEffect(() => { selectedDateRef.current = endDate ?? null; }, [endDate]);

    const handleClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const room = target.closest<SVGGElement>('g[id^="room-"]');
        if (!room) return;

        if (!selectedDateRef.current) {
        Swal.fire({
            icon: "info",
            title: "Select a Date Range First!",
            text: "Please select a date range before choosing a room.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3085d6",
        });
        return;
        }

        const roomNumber = room.id.replace("room-", "");
        if (bookedRoomsRef.current.includes(roomNumber)) return;

        if (selectedRoomsRef.current.length >= 5 && !selectedRoomsRef.current.includes(room.id)) {
        Swal.fire({
            icon: "warning",
            title: "Maximal Reached!",
            text: "You have reached the maximum number of rooms that can be selected.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3085d6",
        }).then(() => applyStyles());
        return;
        }

        setSelectedRooms((prev) => {
        const next = prev.includes(room.id)
            ? prev.filter((id) => id !== room.id)
            : [...prev, room.id];
        selectedRoomsRef.current = next; // sync ref
        return next;
        });
    };

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;
        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
    }, []);
};