import { getBookingById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import ImagesCardInput from "../ImageGallery";
import PaymentButton from "@/app/components/ui/common/PaymentButton";
import CheckoutTable from "./CheckoutTable";

const CheckoutDetail = async ({ bookingId }: { bookingId: string }) => {
  const [booking] = (await getBookingById(bookingId)) ?? [];
  
  if (!booking) {
    return <h1>No Reservation Found</h1>;
  }


  const reservations = Array.isArray(booking.Reservations)
  ? booking.Reservations
  : [booking.Reservations];


  return (
    <>
      {/* card reserve */}
      <div className="mb-20 transition-all duration-600 ease-in-out">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="w-full h-max bg-white  mx-auto mb-8 rounded-l-2xl md:rounded-2xl flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-[40%]">
              <ImagesCardInput image={reservation.Room.RoomType.image} />
            </div>
            <div className="flex flex-col w-full md:w-[60%] p-5">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <h1 className="font-bold text-2xl md:text-3xl">{reservation.Room.RoomType.name}</h1>
                <span className="text-[22px] sm:text-[24px] md:text-[26px]">{formatCurrency(reservation.price)} / Night</span>
              </div>
              <div className="w-full mx-auto h-px bg-gray-300 my-4"></div>
                <CheckoutTable booking={booking} reservation={reservation}/>
            </div>
          </div>
        ))}
      </div>

      {/* button payment */}
      <div className="absolute bottom-5 left-0 px-5 w-full max-w-screen-2xl flex justify-center">
          <div className="flex flex-wrap justify-center min-[380px]:justify-between w-full items-center">
            <div className="text-[24px] flex flex-col md:flex-row items-center">
                <p className="font-bold">Grand total :&nbsp;</p>
                <p>{formatCurrency(booking.totalPrice)}</p>
            </div>
            <div>
                <PaymentButton booking={booking}/>
            </div>
          </div>
      </div>
    </>
  );
};

export default CheckoutDetail;
