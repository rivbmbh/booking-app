'use client';

import { useEffect, useState } from 'react';

export default function FloorPlan2nd() {
  const [svg,  setSvg] = useState('');

  useEffect(() => {
    fetch('/floorplans/lantai_2.svg')
      .then(res => res.text())
      .then(setSvg);
  }, []);

  useEffect(() => {
    if (!svg) return;

    const container = document.getElementById('svg-container');
    if (!container) return;

    const handleClick = (e) => {
      const target = e.target;

      // Naik ke parent <g id="room-xxx">
      const room = target.closest('g[id^="room-"]');// cari tag <g> dengan id diawali "room-"

      if (!room) return; // jika tidak ada, keluar

      alert(`Klik kamar ${room.id.replace('room-', '')}`);
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [svg]);





  return (
    <div
      id="svg-container"
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full h-[600px]"
    />
  );
}
