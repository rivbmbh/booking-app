import { formatCurrency } from "@/lib/utils";
import { RoomWithDetailsProps } from "@/types/room";
import { useEffect, useMemo, useState } from "react";

type RoomCacheItem = {
    roomNumber: string;
    RoomType: {
        price: number;
    };
};

export const useRoomSelection = (
    setRoomData: (data: RoomWithDetailsProps[]) => void
) => {
    const [selectedRooms, setSelectedRooms] = useState<string[]>([])
    const [roomCache, setRoomCache] = useState<Record<string, RoomCacheItem>>({})

    const grandPrice = useMemo(() => {
    const total = selectedRooms.reduce((sum, room) => {
        const info = roomCache[room.replace("room-", "")];
        return sum + (info?.RoomType.price ?? 0);
    }, 0);
    return formatCurrency(total);
    }, [selectedRooms, roomCache]);

    useEffect(() => {
        if(selectedRooms.length === 0) return;
        const controller =  new AbortController();
        const timeout = setTimeout(async ()=> {
            try {
                const roomNumbers = selectedRooms.map((r) => r.replace("room-", ""));
                const res = await fetch("/api/room/selected", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomNumbers }),
                    signal: controller.signal
                })
                const data = await res.json();

                setRoomCache((prev) => {
                    const next = { ...prev };
                    data
                        .filter((r: RoomCacheItem) => !prev[r.roomNumber])
                        .forEach((r: RoomCacheItem) => (next[r.roomNumber] = r));
                    return next;
                });

                setRoomData(data);
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") console.error(err);
            }
        }, 300)

        return () => {
            controller.abort();
            clearTimeout(timeout);
        }
    }, [selectedRooms, setRoomData])

    return { selectedRooms, setSelectedRooms, grandPrice }
}