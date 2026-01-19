import { getReservationByUserId } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const MyReserveList = async () => {
  const reservation = await getReservationByUserId();
  if (!reservation) notFound();
  return (
    <div>
      {reservation.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow pb-4 mb-4 md:pb-0 relative"
        >
          <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-t-sm ">
            <div className="text-sm flex">
              <h1 className="font-semibold text-gray-900">Reservation ID :</h1>
              &nbsp;
              <p className="font-normal">#{item.id}</p>
            </div>
            <div className="flex gap-1 px-3 py-2 text-sm font-normal">
              <span>Status :</span>
              <span
                className={`font-bold uppercase ${
                  item.Payment?.status === "unpaid"
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {item.Payment?.status}
              </span>
            </div>
          </div>
          <div className="flex flex-col mb-4  items-start bg-white md:flex-row md:w-full">
            <Image
              src={item.Room.image}
              width={500}
              height={300}
              className="object-cover w-full h-60 md:h-auto md:w-1/3 md:rounded-none"
              alt="image room"
            />
            <div className="flex items-center gap-1 mb-3 p-2 font-normal text-gray-800">
              <div className="w-full">
                <div className="grid grid-cols-[120px_10px_1fr]">
                  <span className="w-36">Price</span>
                  <span className="w-3">:</span>
                  <span>{formatCurrency(item.Room.price)}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                  <span className="w-36">Arrival</span>
                  <span className="w-3">:</span>
                  <span>{formatDate(item.startDate.toISOString())}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                  <span className="w-36">Departure</span>
                  <span className="w-3">:</span>
                  <span>{formatDate(item.endDate.toISOString())}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                  <span className="w-36">Duration</span>
                  <span className="w-3">:</span>
                  <span>
                    {differenceInCalendarDays(item.endDate, item.startDate)}
                    <span className="ml-1">Night</span>
                  </span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                  <span className="w-36">Sub Total</span>
                  <span className="w-3">:</span>
                  <span>
                    {item.Payment && formatCurrency(item.Payment.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end absolute inset-4">
            {item.Payment?.status === "unpaid" ? (
              <Link
                href={`/checkout/${item.id}`}
                className="px-6 py-1 bg-primary text-white rounded-md hover:bg-primary-hover"
              >
                Pay Now
              </Link>
            ) : (
              <Link
                href={`/myreservation/${item.id}`}
                className="px-5 py-1 bg-primary text-white rounded-md hover:bg-primary-hover"
              >
                View Detail
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReserveList;
