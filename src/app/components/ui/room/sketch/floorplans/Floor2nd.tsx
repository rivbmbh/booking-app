'use client';

import { useEffect, useState } from 'react';

export default function FloorPlan2nd() {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    fetch('/floorplans/2ndfloor.min.svg')
      .then(res => res.text())
      .then(setSvg);
  }, []);

  useEffect(() => {
    const room = document.getElementById('room-101');
    console.info(room)
    room?.addEventListener('click', () => {
      alert('Room 101 clicked');
    });
  }, [svg]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full h-[600px]"
    />
  );
}
