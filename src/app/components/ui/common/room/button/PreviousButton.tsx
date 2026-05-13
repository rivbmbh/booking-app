"use client"
import { useRouter } from 'next/navigation'
import { FaAngleLeft } from 'react-icons/fa6'

const PreviousButton = () => {
    const router = useRouter()
    const handleClick = () => {
        router.back()    }
  return (
    <button 
      className="rounded-full bg-primary hover:bg-primary-hover active:scale-105 p-2 w-max flex justify-center items-center"
      onClick={handleClick}
    >
        <FaAngleLeft className="size-5 text-white"/>
    </button>
  )
}

export default PreviousButton