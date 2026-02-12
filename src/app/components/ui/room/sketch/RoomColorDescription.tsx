import React from 'react'

const RoomColorDescription = () => {
  return (
    <div className=''>
        <ul className='grid grid-cols-2 gap-6 justify-between'>
            <li className='space-y-2.5'>
              <div className='w-10 h-10 bg-white mx-auto border border-gray-500'></div>
              <p className='text-center'>Available</p>
            </li>
            <li className='space-y-2.5'>
              <div className='w-10 h-10 bg-gray-500 mx-auto border border-gray-500'></div>
              <p className='text-center'>Booked</p>
            </li>
            <li className='space-y-2.5'>
              <div className='w-10 h-10 bg-[#0459e0] mx-auto border border-gray-500'></div>
              <p className='text-center'>Selected</p>
            </li>
            <li className='space-y-2.5'>
              <div className='w-10 h-10 bg-red-500 mx-auto border border-gray-500'></div>
              <p className='text-center'>Renovation</p>
            </li>
        </ul>
    </div>
  )
}

export default RoomColorDescription