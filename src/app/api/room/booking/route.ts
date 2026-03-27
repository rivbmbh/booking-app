import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { differenceInCalendarDays } from "date-fns"

export async function POST(req: Request) {
    const {startDate, endDate, roomIds} = await req.json()
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id},
        select: {
            phone: true,
            name: true
        }
    })

    if(!roomIds || roomIds.length === 0){
        return Response.json({message: "No rooms selected"}, { status: 400})
    }

    if (roomIds.length > 5) {
        return Response.json(
            { message: "Maksimal 5 kamar" },
            { status: 400 }
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
    return Response.json(
        { message: "Invalid dates" },
        { status: 400 }
    );
    }

    if (start < new Date()) {
    return Response.json(
        { message: "Selected date cannot be earlier than today." },
        { status: 400 }
    );
    }
    const roomsNumber = roomIds.map((id: string) =>
        id.replace("room-", "")
)


    try {
        const result = await prisma.$transaction(async (tx) => {

            const conflicts = await tx.reservation.findMany({
                where: {
                    Room: {
                        roomNumber: { in: roomsNumber }
                    },
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
                    roomNumber: {in: roomsNumber}
                },
                include: {
                    RoomType: true
                }
            })

            if (rooms.length !== roomsNumber.length) {
                throw new Error("One or more rooms were not found.");
            }
            
            const nights = differenceInCalendarDays(
            new Date(endDate),
            new Date(startDate)
            );

            const totalPrice = rooms.reduce((sum, r) => {
            return sum + r.RoomType.price * nights;
            }, 0);

            const booking = await tx.booking.create({
                data: {
                    userId: session.user.id,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPrice,
                    status: "PENDING"
                }
            })

            await tx.payment.create({
            data: {
                bookingId: booking.id,
                amount: totalPrice,
                status: "unpaid"
            }
});
            await tx.reservation.createMany({
                data: rooms.map((room)=> ({
                    guestName: user!.name || session.user.name,
                    guestPhone: user!.phone,
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
    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 400 }
    );
    }
}