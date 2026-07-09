import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { bookingProps } from "@/types/booking";
import { prisma } from "@/lib/prisma";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export const POST = async (request: Request) => {
  const booking: bookingProps = await request.json();

  // Validasi status booking langsung dari DB
  const existingBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    select: { status: true },
  });

  if (!existingBooking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  if (existingBooking.status === "EXPIRED" || existingBooking.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Booking is no longer valid" },
      { status: 400 }
    );
  }

  const parameter = {
    transaction_details: {
      order_id: booking.id,
      gross_amount: booking.Payment?.amount || 0,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: booking.User.name,
      email: booking.User.email,
    },
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
};