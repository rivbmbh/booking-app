import { formatDate } from '@/lib/utils';
import { getRooms, getRoomType, getRoomTypeOptions } from '@/lib/data';
import SortButton from '../button/SortButton';
import { DeleteButton, EditButton } from '../button/Buttons';
import SearchFilterBar from '../form/SearchFilterBar';

type Props = {
  searchParams: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    floor?: string;
    roomTypeId?: string;
  };
};
const RoomTable = async ({ searchParams }: Props) => {
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
    <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">

      <SearchFilterBar roomTypeOptions={roomTypeOptions ?? []} />
    
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-1 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              <SortButton label="Room Number" field="roomNumber" />
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              <SortButton label="Floor" field="floor" />
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              Room Type
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              <SortButton label="Status" field="status" />
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              <SortButton label="Updated At" field="updatedAt" />
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!rooms.length || !roomTypes || !roomTypeOptions ? (
          <p className="text-center text-gray-500 py-10">No rooms match your filter.</p>
        ) : (
          rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">{room.roomNumber}</td>
              <td className="px-6 py-4">{room.floor}</td>
              <td className="px-6 py-4">
                {roomTypes.find((rt) => rt.id === room.roomTypeId)?.name}
              </td>
              <td className={`px-6 py-4 capitalize ${room.status === "ACTIVE" ? "" : "text-red-500 font-bold"}`}>
                {room.status.toLowerCase()}
              </td>
              <td className="px-6 py-4">{formatDate(room.updatedAt.toDateString())}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-center items-center gap-1.5">
                  <EditButton id={room.id} url="/admin/room/edit" />
                  <DeleteButton id={room.id} />
                </div>
              </td>
            </tr>
          ))
        )}  
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;