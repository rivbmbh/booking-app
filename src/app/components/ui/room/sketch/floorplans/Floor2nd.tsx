'use client';

import { useEffect, useState } from 'react';

type Props = {
  bookedRooms: string[];
  selectedRooms: string[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<string[]>>;
};

const FloorPlan2nd = ({
  bookedRooms,
  selectedRooms,
  setSelectedRooms,
}: Props) => {
  console.info(selectedRooms)
  const [svg, setSvg] = useState('');

  // ambil SVG
  useEffect(() => {
    fetch('/floorplans/lantai_2.svg')
      .then((res) => res.text())
      .then(setSvg);
  }, []);

  //select room & dislable booked room
  useEffect(() => {
    const container = document.getElementById('svg-container');
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      const room = target.closest<SVGGElement>('g[id^="room-"]');
      if (!room) return;
      console.info(room)

      const roomNumber = room.id.replace('room-', '');

      if (bookedRooms.includes(roomNumber)) return;

      setSelectedRooms((prev) => {
        const isActive = prev.includes(room.id);

        if (isActive) {
          return prev.filter((id) => id !== room.id);
        }
        
        if (prev.length >= 5) {
          alert('maksimal booking hanya 5 kamar dalam sekali klik');
          return prev;
        }

        return [...prev, room.id];
      });
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [bookedRooms, setSelectedRooms]);

  /**
   * 🔥 SINGLE SOURCE RENDER UI (BOOKED + SELECTED)
   */
  useEffect(() => {
    if (!svg) return;

    const container = document.getElementById('svg-container');
    if (!container) return;

    const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');

    rooms.forEach((room) => {
      const roomNumber = room.id.replace('room-', '');

      const bg = room.querySelector<SVGRectElement>('rect[id^="bg"]');
      const label = room.querySelector<SVGPathElement>('path[id^="label"]');

      if (!bg || !label) return;

      const isBooked = bookedRooms.includes(roomNumber);
      const isActive = selectedRooms.includes(room.id);

      // simpan warna asli sekali saja
      if (!bg.dataset.originalFill) {
        bg.dataset.originalFill =
          bg.style.fill || bg.getAttribute('fill') || '';

        label.dataset.originalFill =
          label.style.fill || label.getAttribute('fill') || '';
      }

      /**
       * PRIORITAS 1: BOOKED
       */
      if (isBooked) {
        room.classList.add('booked');
        room.classList.remove('active');

        bg.style.fill = '#6a7282';
        label.style.fill = '#999';

        room.style.pointerEvents = 'none';
        room.style.cursor = 'not-allowed';
        return;
      }

      /**
       * PRIORITAS 2: SELECTED
       */
      if (isActive) {
        room.classList.add('active');
        room.classList.remove('booked');

        bg.style.fill = '#0459e0';
        label.style.fill = 'white';

        room.style.pointerEvents = 'auto';
        room.style.cursor = 'pointer';
        return;
      }

      /**
       * DEFAULT
       */
      room.classList.remove('active', 'booked');

      bg.style.fill = bg.dataset.originalFill || '';
      label.style.fill = label.dataset.originalFill || '';

      room.style.pointerEvents = 'auto';
      room.style.cursor = 'pointer';
    });
  }, [svg, bookedRooms, selectedRooms]);

  return (
    <div
      id="svg-container"
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full h-full cursor-pointer"
    />
  );
};

export default FloorPlan2nd;