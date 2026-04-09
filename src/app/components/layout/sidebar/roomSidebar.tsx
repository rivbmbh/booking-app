"use client"
import Image from 'next/image';
import { useState } from 'react';
import { FaAngleRight, FaKey } from 'react-icons/fa6'
import { IoCaretDownOutline, IoCaretForward, IoPricetags } from 'react-icons/io5';
import ReadMore from '../../ui/common/ReadMore';
import { FaCheckCircle } from 'react-icons/fa';

const roomSidebar = ({ openSidebar, toggleSidebar, selectedRooms }: 
{ 
openSidebar: boolean;
toggleSidebar: () => void; selectedRooms: string[] 
}) => {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
    const handleOpenDetailRoom = (index: number) => {
        setOpenIndexes((prev) =>
            prev.includes(index)
            ? prev.filter((i) => i !== index) // tutup kalau sudah ada
            : [...prev, index] // buka tanpa nutup yang lain
        );
    };

    return (
        <aside 
        className={`fixed right-0 top-0 bg-white px-4 py-6 z-40 w-[98%] md:w-[432px] h-screen transition-all duration-500 ease-in-out pt-21 sm:pt-18 md:pt-16 shadow-lg flex flex-col
        ${openSidebar 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'}
        `}
        >
            <div className="px-2 py-4">
                <button onClick={toggleSidebar} className="rounded-full bg-primary w-max h-max p-1.5">
                    <FaAngleRight className="size-5 text-white"/>
                </button>
                <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex"></div>
                <h1 className="text-black text-lg tracking-wider font-light my-2">Selected Rooms</h1>
            </div>

            <div className='min-h-0 overflow-y-auto flex-1 pt-2 px-0 sm:px-2 md:px-2 pb-14'>
                <ul className="pb-16 h-max space-y-6">
                    {[0,1,2,3,4].map((item, index) => (
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
                                        Room {201 + index}
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
                                    src={`/hero2.jpg`}
                                    alt="Room Image"
                                    width={100}
                                    height={100}
                                    className="w-[400px] h-[230px] rounded-sm"
                                    />

                                    <div className="flex justify-between items-center py-2 w-full overflow-auto">
                                        <h3 className="text-md font-semibold">Deluxe Double</h3>
                                        <span className="text-sm text-gray-800">
                                            Rp 1.790.000/Night
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-gray-200"></div>

                                    <ReadMore text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos dolore numquam dignissimos voluptatum voluptate repellendus maiores, sint nemo aliquam quasi, officiis quos harum obcaecati illo tempore? Atque sunt enim laudantium!" />
                                    
                                    <div>    
                                        <p className='my-2 text-sm font-semibold'>Room Amenities:</p>
                                        <ul className='flex flex-wrap gap-2 text-sm text-gray-600 justify-between'>
                                            <li className='flex items-center gap-1'>Free Wi-Fi <FaCheckCircle className='text-primary'/></li>
                                            <li className='flex items-center gap-1'>Breakfast included <FaCheckCircle className='text-primary'/></li>
                                            <li className='flex items-center gap-1'>Swimming pool <FaCheckCircle className='text-primary'/></li>
                                            <li className='flex items-center gap-1'>Fitness center <FaCheckCircle className='text-primary'/></li>
                                            <li className='flex items-center gap-1'>Smoking room <FaCheckCircle className='text-primary'/></li>
                                            <li className='flex items-center gap-1'>Workdesk & Chair <FaCheckCircle className='text-primary'/></li>

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
    )
}

export default roomSidebar