import Image from 'next/image'
import { IoClose } from 'react-icons/io5'

const ModalChooseBed = () => {
    return (
        <div
        popover="auto"
        id="modal-bedtype"
        className="bg-transparent w-4/5 md:w-[60%] h-max fixed mx-auto top-[15%] rounded-md opacity-0 scale-95 transition-discrete ease-in-out duration-300 [&:popover-open]:opacity-100 [&:popover-open]:scale-100"
        >
            <div className="my-3 overflow-hidden">
                {/* button close */}
                <button
                popoverTarget="modal-bedtype"
                popoverTargetAction="hide"
                className='flex justify-end w-full'
                >
                <IoClose className="size-7 cursor-pointer active:scale-110 rounded-full hover:bg-primary-hover hover:text-white text-gray-700 transition-colors ease-in-out duration-500" />
                </button>

                {/* Form */} 
                <form className="my-3 space-y-3 bg-white rounded-sm shadow-lg pb-4">
                    <div className='px-2'>
                        <h1 className="tracking-wider text-lg text-center pt-4">Choose bed type</h1>

                        <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex" />

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-8 justify-evenly items-center w-full py-3'>
                            <div className='flex flex-col items-center gap-2'>
                                <Image src={`/floorplans/SINGLE.png`} alt='bed' width={28} height={55}/>
                                <p className='text-sm tracking-wider'>Single</p>
                            </div>
                            <div className='flex flex-col items-center gap-2'>
                                <Image src={`/floorplans/TWIN.png`} alt='bed' width={54} height={55}/>
                                <p className='text-sm tracking-wider'>Twin</p>
                            </div>
                            <div className='flex flex-col items-center gap-2'>
                                <Image src={`/floorplans/QUEEN.png`} alt='bed' width={45} height={55}/>
                                <p className='text-sm tracking-wider'>Queen</p>
                            </div>
                            <div className='flex flex-col items-center gap-2'>
                                <Image src={`/floorplans/KING.png`} alt='bed' width={57} height={55}/>
                                <p className='text-sm tracking-wider'>King</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalChooseBed