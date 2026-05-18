'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useRoomStyles } from './hooks/useRoomStyles';
import { useRoomClick } from './hooks/useRoomClick';
import { useSvgLoader } from './hooks/useSVGLoader';

type Props = {
  endDate?: Date | null;
  resetTrigger?: Date | null;
  bookedRooms: string[];
  filteredRooms: string[];
  setSelectedRoomsData: (data: string[]) => void;
};

const FloorPlan2nd = ({ endDate, resetTrigger, bookedRooms, filteredRooms, setSelectedRoomsData }: Props) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null!);

  const { applyStyles, bookedRoomsRef } = useRoomStyles({ containerRef, selectedRooms, bookedRooms, filteredRooms });
  useSvgLoader(containerRef, applyStyles);
  useRoomClick({ containerRef, endDate, bookedRoomsRef, setSelectedRooms, applyStyles });

  // sync ke parent
  useEffect(() => {
    setSelectedRoomsData(selectedRooms);
  }, [selectedRooms, setSelectedRoomsData]);

  // reset saat tanggal berubah
  useEffect(() => {
    startTransition(() => setSelectedRooms([]));
  }, [resetTrigger]);

  return <div ref={containerRef} className="w-full h-full cursor-pointer" />;
};

export default FloorPlan2nd;