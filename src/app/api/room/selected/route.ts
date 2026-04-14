import { prisma } from "@/lib/prisma"

export async function POST(req: Request){
    try {
        const { roomNumbers }: { roomNumbers: string[] } = await req.json()
        
        if (!roomNumbers || !Array.isArray(roomNumbers)) {
            return Response.json({ error: "Invalid roomNumbers" }, { status: 400 })
        }

        const rooms = await prisma.room.findMany({
            where:{
                roomNumber: {
                    in: roomNumbers
                }
            },
            include: {
                RoomType: {
                    select:{
                        image: true,
                        name: true,
                        price: true,
                        description: true,
                        RoomAmenities: {
                            select: {
                                Amenities: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                Reservations: {
                    select: {
                        price: true
                    }
                }
            }
        })
    
        return Response.json(rooms)        
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to fetch rooms" }, { status: 500 })
    }

}   