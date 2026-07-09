import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
        );
    }

    try {
        const now = new Date();

        const result = await prisma.$transaction(async (tx) => {

        // 1. Cari semua bookingId yang punya minimal 1 reservation PENDING
        //    dan sudah melewati expiresAt (artinya sudah timeout 15 menit)
        const expiredBookingIds = await tx.reservation.findMany({
            where: {
                status: "PENDING",
                expiresAt: { lt: now },
            },
            select: {
                bookingId: true,
            },
            distinct: ["bookingId"],
        });

        const bookingIds = expiredBookingIds.map((r) => r.bookingId);

        if (bookingIds.length === 0) {
            return {
                expiredReservations: { count: 0 },
                expiredPayments: { count: 0 },
                expiredBookings: { count: 0 },
            };
        }

        // 2. Expire SEMUA reservation dalam booking tersebut
        //    (termasuk yang belum expired, karena 1 paket booking)
        const expiredReservations = await tx.reservation.updateMany({
            where: {
                bookingId: { in: bookingIds },
                status: "PENDING",
            },
            data: {
                status: "EXPIRED",
            },
        });

        // 3. Expire payment dari booking yang sama
        const expiredPayments = await tx.payment.updateMany({
            where: {
            bookingId: { in: bookingIds },
                status: "unpaid",
            },
            data: {
                status: "expired",
            },
        });

        // 4. Expire booking-nya sekalian
        const expiredBookings = await tx.booking.updateMany({
            where: {
                id: { in: bookingIds },
                status: "PENDING",
            },
            data: {
                status: "EXPIRED",
            },
        });

        return { expiredReservations, expiredPayments, expiredBookings };
        });

        return Response.json({
        success: true,
        updated: result,
        });

    } catch (error) {
        console.error(error);
        return Response.json(
        { success: false, error: "cron job failed" },
        { status: 500 }
        );
    }
}