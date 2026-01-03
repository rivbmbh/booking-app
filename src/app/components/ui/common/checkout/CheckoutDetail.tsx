import { getReservationById } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import Image from "next/image";
import PaymentButoon from "@/app/components/ui/common/PaymentButoon";
import ImagesCardInput from "../ImageGallery";

const CheckoutDetail = async ({ reservationId }: { reservationId: string }) => {
  const reservation = await getReservationById(reservationId);
  console.info(reservation);
  if (!reservation || !reservation.Payment) {
    return <h1>No Reservation Found</h1>;
  }

  const duration = differenceInCalendarDays(
    reservation.endDate,
    reservation.startDate
  );
  return (
    <div className="w-full 2xl:w-5/6 flex flex-col md:flex-row justify-center gap-2">
      <div className="w-full lg:w-[80%]">
        <ImagesCardInput image={reservation.Room.image} />
        <div className="flex flex-col items-start rounded-2xl bg-white border border-gray-200 md:flex-row md:w-full">
          <div className="flex flex-col justify-between p-4 leading-normal w-full">
            <h5 className="mb-1 text-3xl font-bold tracking-tight text-gray-900">
              {reservation.Room.name}
            </h5>
            <div className="flex items-center gap-1 text-2xl text-gray-700">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg">
                  {formatCurrency(reservation.price)}
                </span>
                <span className="text-lg">/ Night</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border border-gray-200 px-3 pt-5 pb-7 bg-white rounded-2xl">
          <table className="w-full mb-5">
            <tbody className="capitalize">
              <tr>
                <td className="py-1">Reservation ID</td>
                <td className="py-1 text-right truncate font-semibold">
                  #{reservation.id}
                </td>
              </tr>
              <tr>
                <td className="py-1">Name</td>
                <td className="py-1 text-right truncate font-semibold">
                  {reservation.User.name}
                </td>
              </tr>
              <tr>
                <td className="py-1">Email</td>
                <td className="py-1 text-right lowercase truncate font-semibold">
                  {reservation.User.email}
                </td>
              </tr>
              <tr>
                <td className="py-1">Phone Number</td>
                <td className="py-1 text-right truncate font-semibold">
                  {reservation.User.phone}
                </td>
              </tr>
              <tr>
                <td className="py-1">Arrival</td>
                <td className="py-1 text-right truncate font-semibold">
                  {formatDate(reservation.startDate.toISOString())}
                </td>
              </tr>
              <tr>
                <td className="py-1">Departure</td>
                <td className="py-1 text-right truncate font-semibold">
                  {formatDate(reservation.endDate.toISOString())}
                </td>
              </tr>
              <tr>
                <td className="py-1">Duration</td>
                <td className="py-1 text-right truncate font-semibold">
                  <span>
                    {duration} {duration <= 1 ? "Night" : "Nights"}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1">Amount in Rupiah</td>
                <td className="py-1 text-right truncate font-semibold">
                  <span>{formatCurrency(reservation.Payment.amount)}</span>
                </td>
              </tr>
              <tr>
                <td className="py-1">Status</td>
                <td className="py-1 text-right truncate font-semibold">
                  <span>{reservation.Payment.status}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <PaymentButoon reservation={reservation} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;
