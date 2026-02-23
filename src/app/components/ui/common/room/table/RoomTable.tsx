
import { DeleteButton, EditButton } from '../button/Button'
import { getRooms, getRoomType } from '@/lib/data'


const RoomTable = async () => {
  const rooms = await getRooms();
  const roomTypes= await getRoomType();
  if (!rooms?.length  || !roomTypes?.length) return <p>No Room Found</p>;

  return (
    <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              room number
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              floor
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              room type
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              status
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">
              action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 ">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">{room.roomNumber}</td>
              <td className="px-6 py-4">{room.floor}</td>     
              <td className="px-6 py-4">{roomTypes!.find(rt => rt.id === room.roomTypeId)?.name}</td>
              <td className="px-6 py-4 capitalize">{room.status.toLowerCase()}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-center items-center gap-1.5">
                    <EditButton id={room.id} url='/admin/room/edit'/>
                    <DeleteButton id={room.id}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RoomTable