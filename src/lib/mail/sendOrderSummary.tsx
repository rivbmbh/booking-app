// lib/mail/sendOrderSummary.ts
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import OrderSummaryPDF from "../pdf/OrderSummaryPDF";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderSummaryEmail(params: {
  to: string;
  bookingId: string;
  guestName: string;
  roomTypeName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  paymentMethod: string;
  roomNumber?: string; // optional, bisa diisi jika ada
  totalGuests?: number; // optional, bisa diisi jika ada
  phone?: string; // optional, bisa diisi jika ada

}) {
  const pdfBuffer = await renderToBuffer(
    <OrderSummaryPDF
      bookingId={params.bookingId}
      guestName={params.guestName}
      roomTypeName={params.roomTypeName}
      startDate={params.startDate}
      endDate={params.endDate}
      totalPrice={params.totalPrice}
      paymentMethod={params.paymentMethod}
      roomNumber={params.roomNumber}
      totalGuests={params.totalGuests}
      phone={params.phone}
    />
  );

  const { data, error } = await resend.emails.send({
    from: "Hotel Booking <onboarding@resend.dev>",
    to: params.to,
    subject: `Order Summary - Booking ${params.bookingId}`,
    html: `<p>Halo ${params.guestName},</p>
          <p>Terima kasih! Pembayaran kamu untuk booking <b>${params.bookingId}</b> sudah berhasil dikonfirmasi.</p>`,
    attachments: [
      {
        filename: `order-summary-${params.bookingId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent successfully:", data);
  return data;
}