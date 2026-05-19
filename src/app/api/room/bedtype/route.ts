import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    const rooms = await prisma.room.findMany({
        select: {
        roomNumber: true,
        RoomType: {
            select: { bedType: true }
        }
        }
    });

    const result = rooms.reduce((acc: Record<string, string>, room: { roomNumber: string; RoomType: { bedType: string } }) => {
        acc[room.roomNumber] = room.RoomType.bedType;
        return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(result);
};