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
        const result = await prisma.$transaction([
            prisma.reservation.updateMany({
                where: {
                    status: 'PENDING',
                    expiresAt: {
                        lt: new Date()
                    }
                },
                data: {
                    status: 'EXPIRED'
                },
            }),
            prisma.payment.updateMany({
                where: {
                    status: "unpaid",
                    Reservation: {
                        expiresAt: { lt: new Date() }
                    }
                },
                data: {
                    status: "expired"
                }
            })
        ])

        return Response.json({
            success: true,
            updated: result
        })
    } catch (error) {
        console.info(error)
        return Response.json(
            {success: false, error: "cron job failed"},
            {status: 500}
        )
    }
}