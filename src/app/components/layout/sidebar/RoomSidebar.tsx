"use client"
import Image from 'next/image';
import { useState } from 'react';
import { FaAngleRight, FaKey } from 'react-icons/fa6'
import { IoCaretDownOutline, IoCaretForward, IoPricetags, } from 'react-icons/io5';
import ReadMore from '../../ui/common/ReadMore';
import { FaCheckCircle } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

const RoomSidebar = ({roomData }: 
{ roomData: string[] }) => {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
    const [openSidebar, setOpenSidebar] = useState(false)
    const toggleSidebar = () => {
        setOpenSidebar((prev) => !prev)
    }
    const handleOpenDetailRoom = (index: number) => {
        setOpenIndexes((prev) =>
            prev.includes(index)
            ? prev.filter((i) => i !== index) // tutup kalau sudah ada
            : [...prev, index] // buka tanpa nutup yang lain
        );
    };

    return (
        <>
        <button type="button" onClick={toggleSidebar} className={`cursor-pointer fixed right-0 top-32 bg-primary w-10 h-10 rounded-l-full flex justify-center items-center p-3 text-white transition-all ease-in-out duration-500 ${roomData.length > 0 && !openSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0' }`}>
            <div className="relative">
            <IoPricetags className="size-5"/>
            <p className="w-5 h-5 absolute -top-6 -right-2.5 rounded-full bg-[#C8A755] text-white text-sm flex items-center justify-center">{roomData.length}</p>
            </div>
        </button>
        <aside 
        className={`fixed right-0 top-0 bg-white px-4 py-6 z-40 w-[98%] md:w-[432px] h-screen transition-all duration-500 ease-in-out pt-21 sm:pt-18 md:pt-16 shadow-lg flex flex-col
        ${openSidebar 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'}
        `}
        >
            <div className="p-2">
                <button onClick={toggleSidebar} className="rounded-full bg-primary w-max h-max p-1.5">
                    <FaAngleRight className="size-5 text-white"/>
                </button>
                <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex"></div>
                <h1 className="text-black text-lg tracking-wider font-light my-2">Selected Rooms</h1>
            </div>

            <div className='min-h-0 overflow-y-auto flex-1 pt-2 px-0 sm:px-2 md:px-2 pb-14'>
                <ul className="pb-16 h-max space-y-6">
                    {roomData.length === 0 && (
                        <div className="flex flex-col items-center gap-2 mt-10">
                            <IoPricetags className="size-10 text-gray-400" />
                            <p className="text-gray-500 text-sm">No rooms selected yet.</p>
                        </div>
                    )}
                    {roomData.map((data, index) => (
                        <div key={index}>
                            <li>
                                <button
                                    onClick={() => handleOpenDetailRoom(index)}
                                    type="button"
                                    className="flex justify-between gap-2 w-full items-baseline py-2"
                                >
                                    <div className='flex justify-center items-center gap-2'>
                                        {openIndexes.includes(index) ? (
                                        <IoCaretDownOutline className="text-sm" />
                                        ) : (
                                        <IoCaretForward className="text-sm" />
                                        )}

                                        <p className="text-base font-semibold tracking-wider">
                                        Room {data.roomNumber}
                                        </p>
                                    </div>

                                    <FaKey className="text-md text-[#C8A755]" />
                                </button>

                                <div
                                    className={`
                                    overflow-hidden transition-all duration-500 ease-in-out
                                    ${openIndexes.includes(index) ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
                                    `}
                                >
                                    <Image
                                    src={data.RoomType.image[0]}
                                    alt="Room Image"
                                    width={100}
                                    height={100}
                                    className="w-[400px] h-[230px] rounded-sm"
                                    />

                                    <div className="flex justify-between items-center py-2 w-full overflow-auto">
                                        <h3 className="text-md font-semibold">{data.RoomType.name}</h3>
                                        <span className="text-sm text-gray-800">
                                            {formatCurrency(data.RoomType.price)} / night
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-gray-200"></div>

                                    <ReadMore text={data.RoomType.description} />
                                    
                                    <div>    
                                        <p className='my-2 text-sm font-semibold'>Room Amenities:</p>
                                        <ul className='flex flex-wrap gap-2 text-sm text-gray-600 justify-between'>
                                            {data.RoomType.RoomAmenities.map((item, index) => (
                                                <li key={index} className='flex items-center gap-1'>{item.Amenities.name} <FaCheckCircle className='text-primary'/></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <div className="w-full h-px bg-gray-200 my-2.5"></div>
                        </div>
                    ))}
                </ul>
            </div>
        </aside> 
        </>
    )
}

export default RoomSidebar