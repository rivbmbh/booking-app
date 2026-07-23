import { renderToBuffer } from "@react-pdf/renderer";
import OrderSummaryPDF from "./OrderSummaryPDF";
import { getBookingDetailById } from "../data";

export async function generateOrderSummaryPdf(bookingId: string) {
    const bookingDetail = await getBookingDetailById(bookingId);

    console.log("Booking detail found:", JSON.stringify(bookingDetail, null, 2));

    if (!bookingDetail) {
        throw new Error("Booking not found");
    }

    if (bookingDetail.Reservations.length === 0) {
        throw new Error("Booking has no reservations");
    }

    const firstReservation = bookingDetail.Reservations[0];

    const pdfBuffer = await renderToBuffer(
        <OrderSummaryPDF
        bookingId={bookingDetail.id}
        guestName={firstReservation.guestName ?? bookingDetail.User.name ?? "Guest"}
        roomTypeName={firstReservation.Room.RoomType.name}
        // roomImageUrl={firstReservation.Room.RoomType.image[0]}
        startDate={firstReservation.startDate.toLocaleDateString("id-ID")}
        endDate={firstReservation.endDate.toLocaleDateString("id-ID")}
        totalPrice={bookingDetail.totalPrice}
        paymentMethod={bookingDetail.Payment?.method ?? "-"}
        roomNumber={firstReservation.Room.roomNumber}
        phoneNumber={bookingDetail.User.phone ?? "-"}
        totalGuests={firstReservation.Room.RoomType.capacity}
        />
    );

    return { pdfBuffer, bookingDetail };
}