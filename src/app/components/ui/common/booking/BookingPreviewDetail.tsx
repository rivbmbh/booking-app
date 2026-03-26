import { getBookingById } from '@/lib/data'

const BookingPreviewDetail = async ({bookingId}: {bookingId: string}) => {
    const [booking] = (await getBookingById(bookingId)) ?? [];
  
    if(!booking){
        return <h1>No Booking Found</h1>
    }

    
  return (
    <div>
        {booking.User.name}
        <pre>{JSON.stringify(booking, null, 2)}</pre>
    </div>
  )
}

export default BookingPreviewDetail