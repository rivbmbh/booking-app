import { getReservation } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";

const ReservationList = async () => {
  const reservation = await getReservation();
  if (!reservation?.length) return <p>No Reservation Found</p>;
  return (
    <div className="bg-white p-4 mt-5 shadow-sm">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              image
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              name
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              arrival
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              departure
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              room name
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              price
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              created at
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">
              status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 ">
          {reservation.map((data) => (
            <tr key={data.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">
                <div className="h-20 w-32 relative">
                  <Image
                    src={data.Room.image}
                    fill
                    sizes="20vw"
                    alt="room image"
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4">{data.User.name}</td>
              <td className="px-6 py-4">
                {formatDate(data.startDate.toISOString())}
              </td>
              <td className="px-6 py-4">
                {formatDate(data.endDate.toISOString())}
              </td>
              <td className="px-6 py-4">{data.Room.name}</td>
              <td className="px-6 py-4">{formatCurrency(data.price)}</td>
              <td className="px-6 py-4">
                {formatDate(data.createdAt.toISOString())}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="capitalize">{data.Payment?.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;
