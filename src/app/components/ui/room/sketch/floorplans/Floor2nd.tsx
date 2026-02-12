'use client';

import { useEffect, useState } from 'react';

export default function FloorPlan2nd() {
  const [svg,  setSvg] = useState('');

  useEffect(() => {
    fetch('/floorplans/lantai_2.svg')
      .then(res => res.text())
      .then(setSvg);//simpan string/text SVG ke state
  }, []);

  useEffect(() => {
    // cek jika svg belum dimuat
    // svg ini bersi string HTML dari gambar SVG yang diambil dari fetch
    if (!svg) return;

    const container = document.getElementById('svg-container');
    if (!container) return;

    const handleClick = (e) => {
      const target = e.target;// target dari event klik, misalnya rooom-201 yang diklik

      /**
       * mencari elemen child dari target yang diklik dengan id dimulai dengan "room-"
       * misalnya <g id="room-201">...</g>
       */ 
      // console.log(target);
      const room = target.closest('g[id^="room-"]');
      // console.log(room);
      if (!room) return; // jika tidak ada, keluar
      const bg = room.querySelector('rect[id^="bg"]');
      const label = room.querySelector('path[id^="label"]');
      if(!bg || !label) return;
      
      // simpan warna awal (sekali saja)
      if (!bg.dataset.originalFill) {
        bg.dataset.originalFill = bg.style.fill || bg.getAttribute('fill') || '';
        label.dataset.originalFill = label.style.fill || label.getAttribute('fill') || '';
      }

      const isActive = room.classList.contains('active');//cek apakah room ini sudah aktif (sudah dipilih)

      if (isActive) {
        // balikin warna awal
        bg.style.fill = bg.dataset.originalFill;
        label.style.fill = label.dataset.originalFill;
        room.classList.remove('active');
      } else {
        // set warna aktif
        bg.style.fill = '#0459e0';
        label.style.fill = 'white';
        room.classList.add('active');
      }
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
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
