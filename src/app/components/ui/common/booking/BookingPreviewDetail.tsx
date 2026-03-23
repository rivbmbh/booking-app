import { getAllBookingById } from '@/lib/data'

const BookingPreviewDetail = async ({bookingId}: {bookingId: string}) => {
    const mybooking =  await getAllBookingById(bookingId)
    console.info(mybooking)

    if(!mybooking){
        return <h1>No Booking Found</h1>
    }

    
  return (
    <div>
            <pre>{JSON.stringify(mybooking, null, 2)}</pre>
    </div>
  )
}

export default BookingPreviewDetail