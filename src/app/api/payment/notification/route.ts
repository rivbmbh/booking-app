import { prisma } from "@/lib/prisma";
import { paymentProps } from "@/types/payment";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const data: paymentProps = await request.json();

  const bookingId = data.order_id;

  const transactionStatus = data.transaction_status;
  const paymentType = data.payment_type || null;
  const fraudStatus = data.fraud_status;
  const statusCode = data.status_code;
  const grossAmount = data.gross_amount;
  const signatureKey = data.signature_key;

  const hash = crypto
    .createHash("sha512")
    .update(
      `${bookingId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");

  if (signatureKey !== hash) {
    return NextResponse.json(
      { error: "Invalid signature key" },
      { status: 400 }
    );
  }

  let responseData = null;

  // SUCCESS PAYMENT
  if (
    transactionStatus === "capture" && fraudStatus === "accept" ||
    transactionStatus === "settlement"
  ) {
    const transaction = await prisma.$transaction(async (tx) => {

      const payment = await tx.payment.update({
        where: { bookingId },
        data: {
          method: paymentType,
          status: "paid",
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });

      await tx.reservation.updateMany({
        where: { bookingId },
        data: { status: "CONFIRMED" },
      });

      return payment;
    });

    responseData = transaction;

  }

  // CANCEL / FAILED
  else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny"
  ) {
    const transaction = await prisma.payment.update({
      where: { bookingId },
      data: {
        method: paymentType,
        status: "failed",
      },
    });

    responseData = transaction;
  }

  // EXPIRED
  else if (transactionStatus === "expire") {
    const transaction = await prisma.payment.update({
      where: { bookingId },
      data: {
        method: paymentType,
        status: "expired",
      },
    });

    responseData = transaction;
  }

  return NextResponse.json({ responseData }, { status: 200 });
};