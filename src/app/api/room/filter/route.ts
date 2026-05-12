import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { roomTypeId }: { roomTypeId: string} = await req.json()
        
        if(!roomTypeId) {
            return NextResponse.json({ message: "roomTypeId is required" }, { status: 400 })
        }
        
        const rooms = await prisma.room.findMany({
            where: {
                status: "ACTIVE",
                deletedAt: null,
                ...(roomTypeId !== "all" && {
                roomTypeId: roomTypeId,
                }),
            },
            select: {
                roomNumber: true,
            },
        });
        const roomNumbers = rooms.map(room => room.roomNumber)
        return NextResponse.json({ roomNumbers });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to filter rooms" }, { status: 500 })
    }
}