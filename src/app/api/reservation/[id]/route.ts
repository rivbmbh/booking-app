import { prisma } from "@/lib/prisma"
import { updateReservationSchema } from "@/lib/zod"
import { NextResponse } from "next/server"


export async function PATCH(
    req: Request, 
    context:  {params: Promise<{id:string}>}) {
    try {
        const body = await req.json()   

        const parsed = updateReservationSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: parsed.error.issues.map(issue => issue.message),
                },
                { status: 400 }
            );
        }

        const {name, phone} = parsed.data;
       const { id } = await context.params;


        // 🔹 Ambil data lama
        const existing = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Reservation not found." },
                { status: 404 }
            );
        }

        if (existing.guestName === name && existing.guestPhone === phone) {
            return NextResponse.json(
                { message: "No changes detected. Please update the data before submitting." },
                { status: 400 }
            );
        }

        const updated = await prisma.reservation.update({
            where: {id},
            data: {
                guestName: name,
                guestPhone: phone
            }
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong while updating the reservation." },
            { status: 500 }
        );
    }
}