import { RefObject, useEffect, useRef } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement> | null;
  selectedRooms: string[];
  bookedRooms: string[];
  filteredRooms: string[];
};


export const useRoomStyles = ({containerRef, selectedRooms, bookedRooms, filteredRooms}: Props) => {
    const selectedRoomsRef = useRef<string[]>(selectedRooms);
    const bookedRoomsRef = useRef<string[]>(bookedRooms);
    const filteredRoomsRef = useRef<string[]>(filteredRooms);

    useEffect(() => { selectedRoomsRef.current = selectedRooms; }, [selectedRooms]);
    useEffect(() => { bookedRoomsRef.current = bookedRooms; }, [bookedRooms]);
    useEffect(() => { filteredRoomsRef.current = filteredRooms; }, [filteredRooms]);

    const applyStyles = () => {
        const container = containerRef!.current;
        if (!container) return;

        const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');
        const isFilterActive = filteredRoomsRef.current.length > 0;

        rooms.forEach((room) => {
            const roomNumber = room.id.replace("room-", "");
            const isBooked = bookedRoomsRef.current.includes(roomNumber);
            const isActive = selectedRoomsRef.current.includes(room.id);
            const isFiltered = filteredRoomsRef.current.includes(roomNumber);

            room.classList.remove("active", "booked", "filtered", "dimmed");

            if (isBooked) room.classList.add("booked");
            else if (isActive) room.classList.add("active");
            else if (isFilterActive && isFiltered) room.classList.add("filtered");
            else if (isFilterActive && !isFiltered) room.classList.add("dimmed");
        });
    };

    // re-apply styles saat data berubah
    useEffect(() => { applyStyles(); }, [selectedRooms, bookedRooms]);
    useEffect(() => {
        filteredRoomsRef.current = filteredRooms;
        applyStyles();
    }, [filteredRooms,]);

    return { applyStyles, bookedRoomsRef, filteredRoomsRef };
    
};