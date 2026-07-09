import { getReservationByUserId } from '@/lib/data';
import { notFound } from 'next/navigation';
import CardReservation from './CardReservation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const ListReservation = async () => {
    const booking = await getReservationByUserId();
    if (!booking) notFound();

    const groupedBookings = Object.values(
      booking.reduce((acc, item) => {
        const date = item.createdAt.toISOString().split("T")[0]; // yyyy-mm-dd

        if (!acc[date]) {
          acc[date] = {
            date,
            bookings: [],
          };
        }

        acc[date].bookings.push(item);

        return acc;
      }, {} as Record<string, { date: string; bookings: typeof booking }>)
    );
    console.log("groupedBookings", groupedBookings);
  return (
    <div>
        <h2 className="text-3xl font-bold text-gray-900">My Reservations</h2>
        {groupedBookings.map((group) => (
          <div key={group.date}>
            <div className="flex items-center my-3 sm:my-5">
              <div className="flex-1 border-t border-gray-300"></div>

              <span className="sm:mx-4 text-sm text-gray-500">
                The room has been booked since{" "}
                {formatDate(group.bookings[0].createdAt.toISOString())}
              </span>

              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className="flex gap-4 items-center text-base">
              <Link href={`/checkout/${group.bookings[0].id}`} className="text-primary underline hover:text-primary-hover active:scale-105">Pay it all</Link>
              <button className="text-primary underline hover:text-primary-hover active:scale-105">Download Receipt</button>
            </div>
            <div className="flex gap-8 w-auto overflow-x-auto overflow-y-hidden pb-10 pr-8">
            {group.bookings.flatMap((item) =>
              (item.Reservations ?? []).map((reservation) => (
                <CardReservation
                  key={reservation.id}
                  roomType={reservation.Room.RoomType.name}
                  image={reservation.Room.RoomType.image[0]}
                  startDate={reservation.startDate.toISOString()}
                  endDate={reservation.endDate.toISOString()}
                  price={reservation.price}
                  bookingStatus={item.status}
                  roomNumber={reservation.Room.roomNumber}
                  expiresAt={reservation.expiresAt}
                />
              ))
            )}
            </div>
          </div>
        ))}
    </div>
  )
}


export default ListReservation