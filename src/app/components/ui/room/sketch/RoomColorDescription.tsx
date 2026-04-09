import Image from 'next/image'
import React from 'react'

const RoomColorDescription = () => {
  return (
    <div className=''>
        <ul className='grid grid-cols-2 gap-6 justify-between text-sm'>
            <li className='space-y-2.5'>
              <div className='w-5 h-5 bg-white mx-auto border border-gray-500'></div>
              <p className='text-center'>Available</p>
            </li>
            <li className='space-y-2.5'>
              <div className='w-5 h-5 bg-gray-500 mx-auto border border-gray-500'></div>
              <p className='text-center'>Booked</p>
            </li>
            <li className='space-y-2.5'>
              <div className='w-5 h-5 bg-[#0459e0] mx-auto border border-gray-500'></div>
              <p className='text-center'>Selected</p>
            </li>
           
            <li className='space-y-2.5'>
              <div className='w-5 h-5 bg-red-500 mx-auto border border-gray-500'></div>
              <p className='text-center'>Renovation</p>
            </li>
             <li className='space-y-2.5'>
              <div className='flex justify-center items-center'>
              <Image src="/floorplans/singlebed.png" alt="Single Bed" width={26} height={26} />
              </div>
              <p className='text-center'>Single Bed</p>
            </li>
             <li className='space-y-2.5'>
              <div className='flex justify-center items-center'>
              <Image src="/floorplans/doublebed.png" alt="Double Bed" width={30} height={30} />
              </div>
              <p className='text-center'>Double Bed</p>
            </li>
        </ul>
    </div>
  )
}

export default RoomColorDescription