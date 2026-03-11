'use client';

import { useEffect, useState } from 'react';


const FloorPlan2nd = ({bookedRooms}: {bookedRooms: string[]}) => {
  const [svg,  setSvg] = useState('');
  console.info(bookedRooms)
  useEffect(() => {
    fetch('/floorplans/lantai_2.svg')
      .then(res => res.text())
      .then(setSvg);//simpan string/text SVG ke state
  }, []);

  //tandai room yang telah dibooking
  useEffect(() => {
    if (!svg) return;

    const container = document.getElementById("svg-container");
    if (!container) return;

    const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');

    rooms.forEach((room) => {
      const roomNumber = room.id.replace("room-", "");

      const bg = room.querySelector<SVGRectElement>('rect[id^="bg"]');
      const label = room.querySelector<SVGPathElement>('path[id^="label"]');

      if (!bg || !label) return;

      const isBooked = bookedRooms?.includes(roomNumber);
      console.info(isBooked)

      if (isBooked) {
        room.classList.add("booked");

        bg.style.fill = "#6a7282";
        label.style.fill = "#999";

        room.style.pointerEvents = "none";
        room.style.cursor = "not-allowed";
      }
    });
  }, [svg, bookedRooms]);

    useEffect(() => {
    if (!svg) return;

    const container = document.getElementById("svg-container");
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      const room = target.closest<SVGGElement>('g[id^="room-"]');

      if (!room) return;

      if (room.classList.contains("booked")) return;

      const bg = room.querySelector<SVGRectElement>('rect[id^="bg"]');
      const label = room.querySelector<SVGPathElement>('path[id^="label"]');

      if (!bg || !label) return;

      const isActive = room.classList.contains("active");

      const activeRooms = [
        ...container.querySelectorAll<SVGGElement>(".active"),
      ].map((el) => el.id);

      /**
       * limit 5 kamar
       */
      if (!isActive && activeRooms.length >= 5) {
        alert("maksimal booking hanya 5 kamar dalam sekali klik");
        return;
      }

      /**
       * simpan warna awal
       */
      if (!bg.dataset.originalFill) {
        bg.dataset.originalFill =
          bg.style.fill || bg.getAttribute("fill") || "";

        label.dataset.originalFill =
          label.style.fill || label.getAttribute("fill") || "";
      }

      /**
       * jika sudah aktif -> deselect
       */
      if (isActive) {
        bg.style.fill = bg.dataset.originalFill;
        label.style.fill = label.dataset.originalFill!;
        room.classList.remove("active");

        return;
      }

      /**
       * select room
       */
      bg.style.fill = "#0459e0";
      label.style.fill = "white";

      room.classList.add("active");
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [svg]);


  return (
    <div
      id="svg-container"
      dangerouslySetInnerHTML={{ __html: svg }}//dan disini diubah menjadi HTML tag biasanya
      className="w-full h-full cursor-pointer"
    />
  );
}

export default FloorPlan2nd
