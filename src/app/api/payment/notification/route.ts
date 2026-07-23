import { prisma } from "@/lib/prisma";
import { paymentProps } from "@/types/payment";
import { BookingStatus, ReservationStatus } from "@prisma/client";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendOrderSummaryEmail } from "@/lib/mail/sendOrderSummary";

export const POST = async (request: Request) => {
  try {
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
      .update(`${bookingId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest("hex");

    if (signatureKey !== hash) {
      console.error("Signature mismatch");
      return NextResponse.json({ error: "Invalid signature key" }, { status: 400 });
    }

    // Cek dulu apakah booking benar-benar ada sebelum mencoba update
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true },
    });

    if (!existingBooking) {
      console.warn(`Booking ${bookingId} not found — likely a Midtrans test notification, ignoring.`);
      return NextResponse.json({ message: "Booking not found, notification ignored" }, { status: 200 });
    }

    let responseData = null;

    if (
      (transactionStatus === "capture" && fraudStatus === "accept") ||
      transactionStatus === "settlement"
    ) {
      const transaction = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { bookingId },
          data: { method: paymentType, status: "paid" },
        });

        await tx.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.CONFIRMED },
        });

        await tx.reservation.updateMany({
          where: { bookingId },
          data: { status: ReservationStatus.CONFIRMED },
        });

        return payment;
      });

      responseData = transaction;

      // Ambil data lengkap booking untuk keperluan PDF & email
      const bookingDetail = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          User: true,
          Reservations: {
            include: { Room: { include: { RoomType: true } } },
          },
        },
      });

      if (bookingDetail?.User?.email && bookingDetail.Reservations.length > 0) {
        try {
          await sendOrderSummaryEmail(bookingDetail.id, bookingDetail.User.email);
        } catch (emailError) {
          console.error("Failed to send order summary email:", emailError);
        }
      } else {
        console.warn(`Booking ${bookingId} has no user email or reservations, skipping email.`);
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "deny") {
      responseData = await prisma.payment.update({
        where: { bookingId },
        data: { method: paymentType, status: "failed" },
      });
    } else if (transactionStatus === "expire") {
      responseData = await prisma.payment.update({
        where: { bookingId },
        data: { method: paymentType, status: "expired" },
      });
    }

    return NextResponse.json({ responseData }, { status: 200 });
  } catch (error) {
    console.error("Notification handler error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
};