import { renderToBuffer } from "@react-pdf/renderer";
import OrderSummaryPDF, { ReservationItem } from "./OrderSummaryPDF";
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

    const reservations: ReservationItem[] = bookingDetail.Reservations.map((res) => ({
        roomTypeName: res.Room.RoomType.name,
        roomNumber: res.Room.roomNumber,
        guestName: res.guestName ?? bookingDetail.User.name ?? "Guest",
        guestPhone: res.guestPhone ?? bookingDetail.User.phone ?? "-",
        startDate: res.startDate.toLocaleDateString("id-ID"),
        endDate: res.endDate.toLocaleDateString("id-ID"),
        totalGuests: res.Room.RoomType.capacity, // sesuaikan kalau ada field jumlah tamu aktual per reservation
        price: res.price,
    }));
  
    // const firstReservation = bookingDetail.Reservations[0];

    const pdfBuffer = await renderToBuffer(
        <OrderSummaryPDF
        bookingId={bookingDetail.id}
        orderedByName={bookingDetail.User.name ?? "Guest"}
        phoneNumber={bookingDetail.User.phone ?? "-"}
        paymentMethod={bookingDetail.Payment?.method ?? "-"}
        totalPrice={bookingDetail.totalPrice}
        reservations={reservations}
        />
    );

    return { pdfBuffer, bookingDetail };
}