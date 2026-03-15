import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { bookingProps } from "@/types/booking";

const snap = new Midtrans.Snap({
  isProduction: false, //jika sudah pada production ubah value ini ke TRUE agar bisa menggunakan uang digital yang asli
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export const POST = async (request: Request) => {
  const booking: bookingProps = await request.json();

  const parameter = {
    transaction_details: {
      order_id: booking.id,
      gross_amount: booking.Payment?.amount || 0 || null,
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
