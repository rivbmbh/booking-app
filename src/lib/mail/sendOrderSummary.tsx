import { Resend } from "resend";
import { generateOrderSummaryPdf } from "@/lib/pdf/generateOrderSummaryPdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderSummaryEmail(bookingId: string, toEmail: string) {
  const { pdfBuffer, bookingDetail } = await generateOrderSummaryPdf(bookingId);

  const { data, error } = await resend.emails.send({
     from: "Sangiara Digital <onboarding@resend.dev>",
    to: toEmail,
    subject: `Order Summary - Booking ${bookingId}`,
    html: `<p>Halo ${bookingDetail.User.name ?? "Guest"},</p>
          <p>Terima kasih! Pembayaran kamu untuk booking <b>${bookingId}</b> sudah berhasil dikonfirmasi.</p>`,
    attachments: [
      {
        filename: `order-summary-${bookingId}.pdf`,
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