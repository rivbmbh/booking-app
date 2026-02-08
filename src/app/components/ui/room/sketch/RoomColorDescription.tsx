import React from 'react'

const RoomColorDescription = () => {
  return (
    <div className=''>
        <ul className='flex flex-wrap gap-7'>
            <li className=''>
              <div className='w-10 h-10 bg-white mx-auto'></div>
              <p>Available</p>
            </li>
            <li className=''>
              <div className='w-10 h-10 bg-gray-500 mx-auto'></div>
              <p>Booked</p>
            </li>
            <li className=''>
              <div className='w-10 h-10 bg-red-500 mx-auto'></div>
              <p>Renovation</p>
            </li>
        </ul>
    </div>
  )
}

export default RoomColorDescription