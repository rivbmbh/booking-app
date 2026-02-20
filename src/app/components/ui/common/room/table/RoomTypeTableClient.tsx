"use client"
import { formatCurrency, formatDate } from '@/lib/utils'
import Image from 'next/image'
import { DeleteButton, EditButton } from '../button/Button'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { RoomTypeProps } from '@/types/room'

const RoomTypeTableClient = ({data} : {data: RoomTypeProps[]}) => {
 const [openId, setOpenId] = useState<string | null>(null);
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
          {data!.map((v) => (
            <tr key={v.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">
                <div className="h-20 w-32 relative">
                  <Image
                    src={v.image}
                    fill
                    sizes="20vw"
                    alt="v image"
                    className="object-cover"
                  />
                </div>
              </td>
              {openId  && (
                <td className="px-6 py-4">{v.id}</td>
              )}
              <td className="px-6 py-4">{v.name}</td>
              <td className="px-6 py-4">{v.bedType}</td>
              <td className="px-6 py-4">{v.capacity}</td>
              <td className="px-6 py-4">{formatCurrency(v.price)}</td>
              {openId === v.id  && (
                <>
                  <td className="px-6 py-4">{v.description}</td>
                  <td className="px-6 py-4">
                    {v.RoomAmenities.map(a => a.Amenities.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">{formatDate(v.createdAt.toDateString())}</td>
                </>
              )}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-center items-center gap-1.5">
                    <button
                    onClick={() => toggleDetails(v.id)}
                    className="text-blue-600 underline"
                    > 
                        {openId === v.id ? <FaEye color='black' className='size-5'/> : <FaEyeSlash color='black' className='size-5'/>}
                    </button>
                    <EditButton id={v.id} url='/admin/roomtype/edit'/>
                    <DeleteButton id={v.id} image={v.image} />
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