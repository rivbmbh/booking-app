'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';


type Props = {
  endDate?: Date | null;
  resetTrigger?: Date | null;
  bookedRooms: string[];
  setSelectedRoomsData: React.Dispatch<React.SetStateAction<string[]>>;
};

const FloorPlan2nd = ({ endDate, resetTrigger, bookedRooms, setSelectedRoomsData }: Props) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const svgLoadedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDateRef = useRef<Date | null>(endDate);
  const selectedRoomsRef = useRef<string[]>([]);
  const bookedRoomsRef = useRef<string[]>(bookedRooms);

  useEffect(() => {
    selectedRoomsRef.current = selectedRooms;
  },[selectedRooms])

  useEffect(() => {
    bookedRoomsRef.current = bookedRooms;
  },[bookedRooms])

  useEffect(() => {
    setSelectedRoomsData(selectedRooms);
  }, [selectedRooms, setSelectedRoomsData]);

  const applyStyles = () => {
    const container = containerRef.current;
    if (!container) return;

    const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');
    rooms.forEach((room) => {
      const roomNumber = room.id.replace('room-', '');
      const isBooked = bookedRoomsRef.current.includes(roomNumber);
      const isActive = selectedRoomsRef.current.includes(room.id);

      if (isBooked) {
        room.classList.add('booked');
        room.classList.remove('active');
      } else if (isActive) {
        room.classList.add('active');
        room.classList.remove('booked');
      }else{
        room.classList.remove('active', 'booked');
      }
    });
  };

  //load svg
  useEffect(() => {
    const container = containerRef.current;
    if(!container || svgLoadedRef.current) return;
    
    fetch('/floorplans/floorplan.svg')
      .then((res) => res.text())
      .then((svgText) => {
        container.innerHTML = svgText; // inject sekali saja
        svgLoadedRef.current = true;
        applyStyles(); // apply initial styles setelah SVG dimuat
      });
  }, []);

  useEffect(() => {
    applyStyles();
  }, [selectedRooms, bookedRooms]);
  
  useEffect(() => { 
  selectedDateRef.current = endDate ?? null; 
}, [endDate]);

useEffect(() => {
  startTransition(() => {
    setSelectedRooms([]);
  });
}, [resetTrigger]);

  //Handle click pada room
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const room = target.closest<SVGGElement>('g[id^="room-"]');
      if (!room) return;

      if(!selectedDateRef.current) {
        Swal.fire({
          icon: 'info',
          title: 'Select a Date Range First!',
          text: 'Please select a date range before choosing a room.',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
        })
        return;
      }

      const roomNumber = room.id.replace('room-', '');
      const currentBooked = bookedRoomsRef.current;
      const currentSelected = selectedRoomsRef.current;

      if (currentBooked.includes(roomNumber)) return;

      if (currentSelected.length >= 5 && !currentSelected.includes(room.id)) {
        Swal.fire({
          icon: 'warning',
          title: 'Maximal Reached!',
          text: 'You have reached the maximum number of rooms that can be selected.',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
        }).then(() => applyStyles());
        return;
      }

      setSelectedRooms((prev) =>
        prev.includes(room.id)
          ? prev.filter((id) => id !== room.id)
          : [...prev, room.id]
      );
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);   

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-pointer"
    />
  );
};

export default FloorPlan2nd;