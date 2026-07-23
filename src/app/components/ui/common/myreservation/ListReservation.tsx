import { getReservationByUserId } from '@/lib/data';
import { notFound } from 'next/navigation';
import CardReservation from './CardReservation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const ListReservation = async () => {
  const booking = await getReservationByUserId();
  if (!booking) notFound();

  const groupedByDate = Object.values(
    booking.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { date, bookings: [] };
      acc[date].bookings.push(item);
      return acc;
    }, {} as Record<string, { date: string; bookings: typeof booking }>)
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">My Reservations</h2>

      {groupedByDate.map((dateGroup) => (
        <div key={dateGroup.date} className="mb-10">
          <div className="flex items-center my-3 sm:my-5">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="sm:mx-4 text-sm text-gray-500">
              The room has been booked since{" "}
              {formatDate(dateGroup.bookings[0].createdAt.toISOString())}
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* setiap bookingItem = 1 blok mandiri: tombol + row card miliknya sendiri */}
          {dateGroup.bookings.map((bookingItem) => (
            <div
              key={bookingItem.id}
              className="mb-8 pb-4 border-b border-dashed border-gray-200 last:border-b-0"
            >
              {bookingItem.status === "PENDING" && (
                <div className="flex gap-4 items-center text-base mb-3">
                  <Link
                    href={`/checkout/${bookingItem.id}`}
                    className="text-primary underline hover:text-primary-hover active:scale-105"
                  >
                    Pay this booking
                  </Link>
                </div>
              )}

              <div className="flex gap-8 w-auto overflow-x-auto overflow-y-hidden pb-6 pr-8">
                {(bookingItem.Reservations ?? []).map((reservation) => (
                  <CardReservation
                    key={reservation.id}
                    roomType={reservation.Room.RoomType.name}
                    image={reservation.Room.RoomType.image[0]}
                    startDate={reservation.startDate.toISOString()}
                    endDate={reservation.endDate.toISOString()}
                    price={reservation.price}
                    bookingStatus={bookingItem.status}
                    roomNumber={reservation.Room.roomNumber}
                    paymentStatus={bookingItem.status}
                    expiresAt={reservation.expiresAt}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ListReservation;


