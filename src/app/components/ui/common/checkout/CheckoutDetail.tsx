import { getBookingById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import ImagesCardInput from "../ImageGallery";
import PaymentButton from "@/app/components/ui/common/PaymentButton";
import CheckoutTable from "./CheckoutTable";
import Image from "next/image";

const CheckoutDetail = async ({ bookingId }: { bookingId: string }) => {
  const booking = await getBookingById(bookingId);

  if (!booking) {
    return <h1>No Reservation Found</h1>;
  }

  const isExpiredOrCancelled = booking.status === "EXPIRED" || booking.status === "CANCELLED";

  const reservations = Array.isArray(booking.Reservations)
    ? booking.Reservations
    : [booking.Reservations];

  return (
    <>
      {/* card reserve */}
      <div className="mb-20 transition-all duration-600 ease-in-out">
        {/* Jika expired/cancelled tampilkan banner peringatan */}
        {isExpiredOrCancelled && (
          <div className="w-full px-4 py-3 rounded-lg mb-6 text-center">
            <Image src="/headache.png" alt="Expired Booking" width={100} height={100} className="mx-auto" />
            <p className="font-bold text-lg">Booking {booking.status}</p>
            <p className="text-sm">Payment time has expired. Please create a new booking.</p>
          </div>
        )}

        {/* Kalau masih ada reservation tampilkan, kalau tidak tampilkan pesan */}
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="w-full h-max bg-white mx-auto mb-8 rounded-l-2xl md:rounded-2xl flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-[40%]">
                <ImagesCardInput image={reservation.Room.RoomType.image} />
              </div>
              <div className="flex flex-col w-full md:w-[60%] p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <h1 className="font-bold text-2xl md:text-3xl">{reservation.Room.RoomType.name}</h1>
                  <span className="text-[22px] sm:text-[24px] md:text-[26px]">{formatCurrency(reservation.price)} / Night</span>
                </div>
                <div className="w-full mx-auto h-px bg-gray-300 my-4"></div>
                <CheckoutTable booking={booking} reservation={reservation} />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-400 py-10">
            <p>No rooms available for display.</p>
          </div>
        )}
      </div>

      {/* button payment */}
      <div className="absolute bottom-5 left-0 px-5 w-full max-w-screen-2xl flex justify-center">
        <div className="flex flex-wrap justify-center min-[380px]:justify-between w-full items-center">
          <div className="text-[24px] flex flex-col md:flex-row items-center">
            <p className="font-bold">Grand total :&nbsp;</p>
            {/* Jika expired tampilkan strip, bukan harga */}
            <p>{isExpiredOrCancelled ? "-" : formatCurrency(booking.totalPrice)}</p>
          </div>
          <div>
            <PaymentButton booking={booking} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutDetail;