import { getRooms, getRoomType, getRoomTypeOptions } from "@/lib/data";
import SearchFilterBar from "../form/SearchFilterBar";
import SortButton from "../button/SortButton";
import { formatDate } from "@/lib/utils";


type Props = {
  reservation: any[];
  searchParams: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    floor?: string;
    roomTypeId?: string;
  };
};

const ReservationList = async ({ reservation, searchParams }: Props) => {
    const {
    sortBy = "updatedAt",
    sortOrder = "desc",
    search = "",
    floor = "all",
    roomTypeId = "all",
  } = searchParams;
  
  const rooms = await getRooms(sortBy, sortOrder, search, floor, roomTypeId);
  const roomTypes = await getRoomType();
  const roomTypeOptions = await getRoomTypeOptions();

  return (
    <div className="bg-white p-4 mt-5 shadow-sm">
      <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">
        <SearchFilterBar roomTypeOptions={roomTypeOptions ?? []} />
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-1 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                Name
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                Room Type
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Floor" field="floor" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Room Number" field="roomNumber" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Arrival" field="arrival" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Departure" field="departure" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                Payment Status
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {!rooms.length || !roomTypes || !roomTypeOptions || !reservation.length ? (
            <p className="text-center text-gray-500 py-10">No reservations match your filter.</p>        
          ) : (
              reservation.map((res) => (
                <tr key={res.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4">{res.Booking?.User.name}</td>
                  <td className="px-6 py-4">{res.Room?.RoomType?.name}</td>
                  <td className="px-6 py-4">{res.Room?.floor}</td>
                  <td className="px-6 py-4">{res.Room?.roomNumber}</td>
                  <td className="px-6 py-4">{formatDate(res.startDate)}</td>
                  <td className="px-6 py-4">{formatDate(res.endDate)}</td>
                  <td className={`px-6 py-4 uppercase ${res.Booking?.Payment.status === BookingStatus.CONFIRMED || res.Booking?.Payment.status === BookingStatus.PENDING ? "" : "text-red-500 font-bold"}`}>{res.Booking?.Payment.status}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-center items-center gap-1.5">
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
    </div>  
  )
}
export default ReservationList