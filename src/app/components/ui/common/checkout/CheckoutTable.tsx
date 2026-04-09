"use client"
import { formatDate } from '@/lib/utils'
import { bookingProps } from '@/types/booking'
import { reservationProps } from '@/types/reservation'
import { differenceInCalendarDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'

const CheckoutTable = ({booking, reservation}: {booking: bookingProps, reservation: reservationProps}) => {
    const router = useRouter();
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
    if (isEditing) {
        nameInputRef.current?.focus();
    }
    }, [isEditing]);

    const [form, setForm] = useState({
        name: reservation.guestName || "",
        phone: reservation.guestPhone|| ""
    })

    const handleEditClick = () => {
        if(isEditing){
            handleSubmit()
        }else{
            setIsEditing(true)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/reservation/${reservation.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if(!res.ok){
                throw new Error(data.message)
            }
            setIsEditing(false)
            setErrorMessage("")
            router.refresh()
        } catch (error) {
            console.info(error)
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage("Something went wrong")
            }
        }
    }


    const duration = differenceInCalendarDays(
        booking.endDate,
        booking.startDate
    );
    
    const handleCloseError = () => {
        setErrorMessage("")
    }
    return (
        <>
        <div className="w-full relative pt-2 overflow-x-scroll md:w-auto md:overflow-hidden">
            {isEditing && (
                <div className={`absolute top-0 w-max right-0 transform transition-all duration-300 ${errorMessage ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
                    <div className='flex items-center gap-2'>
                        <p className='text-sm text-red-500 italic'>{errorMessage}</p>
                        <button type='button' onClick={handleCloseError}><IoCloseOutline/></button>
                    </div>
                </div>
            )}
    
            <table className="w-full mb-5 mt-2">
                <tbody className="capitalize text-[22px] tracking-widest">
                    {/* NAME */}
                    <tr>
                        <td>Name</td>
                        <td className="text-right truncate py-1">
                            {isEditing ? (
                            <input
                                ref={nameInputRef}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="text-right bg-gray-200 border-none focus:outline-none focus:ring-0 rounded-sm"
                                maxLength={30}
                                minLength={4}
                            />
                            ) : (
                            reservation.guestName
                            )}
                        </td>
                    </tr>
                    {/* PHONE */}
                    <tr>
                        <td>Phone Number</td>
                        <td className="text-right truncate py-1">
                            {isEditing ? (
                            <input
                                name="phone"
                                type='text'
                                value={form.phone}
                                onChange={handleChange}
                                className="text-right bg-gray-200 border-none focus:outline-none focus:ring-0 rounded-sm"
                                minLength={11}
                                maxLength={12}
                            />
                            ) : (
                            reservation.guestPhone ? reservation.guestPhone : "No phone number provided"
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="">Email</td>
                        <td className=" text-right lowercase truncate">
                        {booking.User.email}
                        </td>
                    </tr>
                    <tr>
                        <td className="">Arrival</td>
                        <td className=" text-right truncate py-1">
                        {formatDate(booking.startDate.toISOString())}
                        </td>
                    </tr>
                    <tr>
                        <td className="">Departure</td>
                        <td className=" text-right truncate py-1">
                        {formatDate(booking.endDate.toISOString())}
                        </td>
                    </tr>
                    <tr>
                        <td className="">Duration</td>
                        <td className=" text-right truncate py-1">
                        <span>
                            {duration} {duration <= 1 ? "Night" : "Nights"}
                        </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="">Room Number</td>
                        <td className=" text-right truncate py-1">
                        <span>
                            {reservation.Room.roomNumber}
                        </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="flex justify-end">
            {isEditing && (
                <button
                    onClick={() => {
                    setIsEditing(false);
                    setForm({
                        name: booking.User.name || "",
                        phone: booking.User.phone || "",
                    });
                    }}
                    className="w-32 h-9 text-[21px] tracking-wider mt-4 bg-primary rounded-md text-white hover:bg-primary-hover active:scale-105 flex justify-center items-center uppercase font-light mr-4"
                >
                    CANCEL
                </button>
            )}
            <button onClick={handleEditClick} className="w-32 h-9 text-[21px] tracking-wider mt-4 bg-primary rounded-md text-white hover:bg-primary-hover active:scale-105 flex justify-center items-center uppercase font-light">{isEditing ? "CONFIRM" : "EDIT"}</button>
        </div>
        </>
    )
}

export default CheckoutTable