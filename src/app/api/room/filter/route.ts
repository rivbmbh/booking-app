import { prisma } from "@/lib/prisma"
import { BedType } from "@/types/room";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { roomTypeId, bedTypeName }: { roomTypeId: string, bedTypeName: string } = await req.json()
        
        if(!roomTypeId || !bedTypeName) {
            return NextResponse.json({ message: "roomTypeId and bedTypeName are required" }, { status: 400 })
        }
        
        const rooms = await prisma.room.findMany({
            where: {
                status: "ACTIVE",
                deletedAt: null,
                //jika roomTypeId bukan "all", maka tambahkan filter untuk roomTypeId, jika tidak, maka tidak usah menambahkan filter untuk roomTypeId maupun bedTypeName
                ...(roomTypeId !== "all" && {
                roomTypeId: roomTypeId,
                }),
                ...(bedTypeName !== "all" && {           
                bedType: bedTypeName as BedType,         
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