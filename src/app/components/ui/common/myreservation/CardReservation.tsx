import { formatCurrency, formatDate } from '@/lib/utils'
import Image from 'next/image'
import CountdownPaid from './CountdownPaid';
import { BookingStatus } from '@prisma/client';

type props = {
    roomType?: string,
    image?: string,
    startDate?: Date | string,
    endDate?: Date | string,
    price?: number,
    bookingStatus?: string,
    roomNumber?: string,
    expiresAt?: Date,
    // extraAmenities?: number
}

const CardReservation = ({roomType, image, startDate, endDate, price, bookingStatus, roomNumber, expiresAt}: props) => {

    function calculateDuration(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMilliseconds = end.getTime() - start.getTime();
        const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
        return durationInDays;
    }
    
    const duration = calculateDuration(startDate as string, endDate as string);
    return (
        <div className="flex mt-5">
            <div className='bg-primary w-4 sm:h-80 rounded-l-2xl'></div>
            <div className="relative flex flex-col gap-7 justify-between cursor-pointer bg-white w-max sm:w-[700px] shadow-2xl p-4 rounded-r-2xl">
                <div className="">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-lg">{roomType}</h4>
                        <CountdownPaid expiresAt={expiresAt || new Date()}/>
                    </div>

                    <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex mb-2"></div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="w-full sm:w-[35%] rounded-l-2xl overflow-hidden group">
                            <Image src={image || '/default-room-image.jpg'} alt="Room Image" width={100} height={100} className="object-cover w-full" />
                        </div>
            
                        <table className="w-full sm:w-[65%] text-gray-800 text-sm">
                            <tbody className="capitalize tracking-widest leading-3 sm:leading-0">
                                <tr>
                                    <td>Room Number</td>
                                    <td className="text-right truncate py-1">{roomNumber}</td>
                                </tr>
                                <tr>
                                    <td>Arrival</td>
                                    <td className="text-right truncate py-1">{formatDate(startDate as string)}</td>
                                </tr>
                                <tr>
                                    <td>Departure</td>
                                    <td className="text-right truncate py-1">{formatDate(endDate as string)}</td>
                                </tr>
                                <tr>
                                    <td>Duration</td>
                                    <td className="text-right truncate py-1">{duration} nights</td>
                                </tr>
                                
                                <tr>
                                    <td>Guest</td>
                                    <td className="text-right truncate py-1">2 People</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <table className="w-full text-gray-800 text-sm">
                    <tbody className="capitalize tracking-widest leading-2.5">
                        <tr>
                            <td>Price</td>
                            <td className="text-right truncate py-1">{formatCurrency(price || 0)   }</td>
                        </tr>
                        <tr>
                            <td>Extra Amenities</td>
                            <td className="text-right truncate py-1">{formatCurrency(0)}</td>
                        </tr>
                        <tr className="w-full">
                            <td>
                                <div className="w-full mx-auto h-px bg-gray-500 relative inline-flex mb-2"></div>
                            </td>
                            <td>
                                <div className="w-full mx-auto h-px bg-gray-500 relative inline-flex mb-2"></div>
                            </td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Sub Total</td>
                            <td className="text-right truncate py-1 font-bold">{formatCurrency(price || 0)}</td>
                        </tr>
                    </tbody>
                </table>
            {bookingStatus === BookingStatus.CONFIRMED ? (
            <div className="absolute bottom-8 left-0 sm:left-5 flex justify-center w-full -rotate-12 sm:rotate-0">
                <Image src="/CONFIRMED.png" width={320} height={100} alt="payment status" />
            </div>
            ) : bookingStatus === BookingStatus.CANCELLED || bookingStatus === BookingStatus.EXPIRED ? (
            <div className="absolute bottom-8 left-0 sm:left-5 flex justify-center w-full -rotate-12 sm:rotate-0">
                <Image src="/CANCEL.png" width={320} height={100} alt="payment status" />
            </div>
            ) : null}
            </div>
        </div>
    )
}

export default CardReservation