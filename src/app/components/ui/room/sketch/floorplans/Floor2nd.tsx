'use client';

import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';


type Props = {
  bookedRooms: string[];
  setSelectedRoomsData: React.Dispatch<React.SetStateAction<string[]>>;
};

const FloorPlan2nd = ({ bookedRooms, setSelectedRoomsData }: Props) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const applyStylesRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSelectedRoomsData(selectedRooms);
  }, [selectedRooms, setSelectedRoomsData]);

  //load svg
  useEffect(() => {
    fetch('/floorplans/floorplan.svg')
      .then((res) => res.text())
      .then(setSvg);
  }, []);

  // handle click room
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // pastikan yang diklik adalah g dengan id yang diawali "room-"
      const room = target.closest<SVGGElement>('g[id^="room-"]');
      if (!room) return;

      // ambil nomor kamar dari id, misal "room-101" -> "101"
      const roomNumber = room.id.replace('room-', '');

      // kalau kamar sudah dibooking, jangan lakukan apa-apa
      if (bookedRooms.includes(roomNumber)) return;
      //jika sudah mencapai batas maksimal 5 kamar, jangan tambahkan lagi
      if (selectedRooms.length >= 5 && !selectedRooms.includes(room.id)) {
          Swal.fire({
              icon: 'warning',
              title: 'Batas Maksimal!',
              text: 'Maksimal booking hanya 5 kamar dalam sekali pesan',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
          }).then(() => {
              // ✅ setelah Swal ditutup, paksa apply styles ulang
              applyStylesRef.current();
          });
        return; // langsung return, tidak masuk ke setSelectedRooms sama sekali
      }
      // toggle selected room
      setSelectedRooms((prev) => {
        const isActive = prev.includes(room.id);

        // jika sudah aktif, maka hapus dari selected
        if (isActive) {
          return prev.filter((id) => id !== room.id);
        }

        return [...prev, room.id];
      });
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [bookedRooms, selectedRooms]);

  // handle styling room (default, booked, active)
  useEffect(() => {
    // penting: pastikan container sudah ter-render sebelum mengakses DOM
    const container = containerRef.current;
    if (!container) return;

    // fungsi untuk mengubah style berdasarkan status room
    const applyStyles = () => {
      const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');

      rooms.forEach((room) => {
        const roomNumber = room.id.replace('room-', '');

        const bg = room.querySelector<SVGRectElement>('rect[id^="bg"]');
        const label = room.querySelector<SVGPathElement>('path[id^="label"]');

        if (!bg || !label) return;

        const isBooked = bookedRooms.includes(roomNumber);
        const isActive = selectedRooms.includes(room.id);

        // simpan warna asli
        if (!bg.dataset.originalFill) {
          bg.dataset.originalFill =
            bg.style.fill || bg.getAttribute('fill') || '';

          label.dataset.originalFill =
            label.style.fill || label.getAttribute('fill') || '';
        }

        if (isBooked) {
          room.classList.add('booked');
          room.classList.remove('active');
          return;
        } else if(isActive){
          room.classList.add('active');
          room.classList.remove('booked');
          return
        } else {
          room.classList.remove('active', 'booked');
        }
      });

    };
    
    applyStylesRef.current = applyStyles;
    const timeout = setTimeout(applyStyles);
    return () => clearTimeout(timeout);
  }, [svg, bookedRooms, selectedRooms]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full h-full cursor-pointer"
    />
  );
};

export default FloorPlan2nd;