"use client"
import { formatCurrency, formatDate } from '@/lib/utils'
import Image from 'next/image'
import { DeleteButton, EditButton } from '../Button'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

const RoomTypeTableClient = ({data}) => {
 const [openId, setOpenId] = useState<string | null>(null);
    console.info(openId);
  const toggleDetails = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              image
            </th>
            {openId && (
                <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                id
                </th>
            )}
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              room type
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              bed type
            </th>
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              capacity
            </th>
             <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
              price 
            </th>
            {openId && (
                <>
                    <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                    description
                    </th>
                    <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                    amenities
                    </th>
                    <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                    created at
                    </th>
                </>
            )}
            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">
              action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 ">
          {data!.map((room) => (
            <tr key={room.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">
                <div className="h-20 w-32 relative">
                  <Image
                    src={room.image}
                    fill
                    sizes="20vw"
                    alt="room image"
                    className="object-cover"
                  />
                </div>
              </td>
              {openId  && (
                <td className="px-6 py-4">{room.id}</td>
              )}
              <td className="px-6 py-4">{room.name}</td>
              <td className="px-6 py-4">{room.bedType}</td>
              <td className="px-6 py-4">{room.capacity}</td>
              <td className="px-6 py-4">{formatCurrency(room.price)}</td>
              {openId === room.id  && (
                <>
                  <td className="px-6 py-4">{room.description}</td>
                  <td className="px-6 py-4">
                    {room.RoomAmenities.map(a => a.Amenities.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">{formatDate(room.createdAt.toDateString())}</td>
                </>
              )}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-center items-center gap-1.5">
                    <button
                    onClick={() => toggleDetails(room.id)}
                    className="text-blue-600 underline"
                    > 
                        {openId === room.id ? <FaEye color='black' className='size-5'/> : <FaEyeSlash color='black' className='size-5'/>}
                    </button>
                    <EditButton id={room.id} />
                    <DeleteButton id={room.id} image={room.image} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RoomTypeTableClient