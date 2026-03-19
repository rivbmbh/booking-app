import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";

export async function POST(req: Request) {
    const {startDate, endDate, roomIds} = await req.json()
    const session = await auth()

     if (!session || !session.user || !session.user.id)
        redirect(`/signin`);

    if(!roomIds || roomIds.length === 0){
        return Response.json({message: "No rooms selected"}, { status: 400})
    }

    try {
        const result = await prisma.$transaction(async (tx) => {

            const conflicts = await tx.reservation.findMany({
                where: {
                    roomId: { in: roomIds},
                    status: { in: ["PENDING", "CONFIRMED"]},
                    OR: [
                        {
                            startDate: {lte: new Date(endDate)},
                            endDate: {gte: new Date(startDate)}
                        }
                    ]
                }
            })

            if(conflicts.length > 0){
                throw new Error("Some rooms are no longer available")
            }

            const rooms = await tx.room.findMany({
                where: {
                    id: {in: roomIds}
                },
                include: {
                    RoomType: true
                }
            })

            const totalPrice = rooms.reduce((sum, r) => {
                return sum + r.RoomType.price
            }, 0)

            const booking = await tx.booking.create({
                data: {
                    userId: session.user.id,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPrice,
                    status: "PENDING"
                }
            })

            await tx.reservation.createMany({
                data: rooms.map((room)=> ({
                    bookingId: booking.id,
                    roomId: room.id,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    price: room.RoomType.price,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 menit
                }))
            });
            return booking
        })

        return Response.json({ bookingId: result.id });
    } catch (error: any) {
        return Response.json(
            { message: error.message },
            { status: 400 }
    );
    }
}