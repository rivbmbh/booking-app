import { getBookingById } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import ImagesCardInput from "../ImageGallery";
import PaymentButton from "@/app/components/ui/common/PaymentButton";

const CheckoutDetail = async ({ bookingId }: { bookingId: string }) => {
  const [booking] = (await getBookingById(bookingId)) ?? [];
  
  console.info(booking)
  if (!booking) {
    return <h1>No Reservation Found</h1>;
  }
  const duration = differenceInCalendarDays(
    booking.endDate,
    booking.startDate
  );

  const reservations = Array.isArray(booking.Reservations)
  ? booking.Reservations
  : [booking.Reservations];


  return (
    <>
      {/* card reserve */}
      <div className="mb-20">
        {reservations.map((reservation) => (
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
              <div className="w-full overflow-x-scroll md:w-auto md:overflow-hidden">
                <table className="w-full mb-5 mt-2">
                  <tbody className="capitalize text-[22px] tracking-widest">
                    <tr>
                      <td className="">Name</td>
                      <td className="text-right truncate">
                        {booking.User.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="">Email</td>
                      <td className=" text-right lowercase truncate">
                        {booking.User.email}
                      </td>
                    </tr>
                    <tr>
                      <td className="">Phone Number</td>
                      <td className=" text-right truncate">
                        {booking.User.phone}
                      </td>
                    </tr>
                    <tr>
                      <td className="">Arrival</td>
                      <td className=" text-right truncate">
                        {formatDate(booking.startDate.toISOString())}
                      </td>
                    </tr>
                    <tr>
                      <td className="">Departure</td>
                      <td className=" text-right truncate">
                        {formatDate(booking.endDate.toISOString())}
                      </td>
                    </tr>
                    <tr>
                      <td className="">Duration</td>
                      <td className=" text-right truncate">
                        <span>
                          {duration} {duration <= 1 ? "Night" : "Nights"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="">Room Number</td>
                      <td className=" text-right truncate">
                        <span>
                          {reservation.Room.roomNumber}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button className="w-32 h-9 text-[21px] tracking-wider mt-4 bg-primary rounded-md text-white hover:bg-primary-hover active:scale-105 flex justify-center items-center uppercase font-light">edit</button>
              </div>
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
