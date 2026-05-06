"use client"
import { useActionState, useEffect, useState } from 'react'
import { IoClose, IoAdd, IoRemove } from 'react-icons/io5'
import SubmitButton from '../button/SubmitButton'
import { saveRoomAmenitiesBatch } from '@/lib/action'
import Swal from 'sweetalert2'

const MAX_INPUTS = 5

const ModalCreateAmenities = () => {
    const [fields, setFields] = useState<string[]>([''])
    const [state, formAction, isPending] = useActionState(
        saveRoomAmenitiesBatch.bind(null),
        null
    )

    const addField = () => {
        if (fields.length < MAX_INPUTS) {
        setFields(prev => [...prev, ''])
        }
    }

    const removeField = (index: number) => {
        if (fields.length === 1) return
        setFields(prev => prev.filter((_, i) => i !== index))
    }

    const updateField = (index: number, value: string) => {
        setFields(prev => prev.map((f, i) => (i === index ? value : f)))
    }

    useEffect(() => {
        if (state?.success) {
            document.getElementById("modal-amenities")?.hidePopover()
            setTimeout(() => setFields(['']), 0)
            Swal.fire({
                icon: 'success',
                title: 'Amenities Successfully Added!',
                text: `Successfully added new amenities`,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
            });
        }
    }, [state])

    return (
        <div>
            <button
                popoverTarget="modal-amenities"
                className="bg-primary px-6 py-2.5 hover:bg-primary-hover text-white font-semibold active:scale-105"
            >
                Add Amenities
            </button>

            <div
            popover="auto"
            id="modal-amenities"
            className="bg-white shadow-2xl w-[30%] h-max fixed mx-auto top-20 rounded-md opacity-0 scale-95 transition-discrete ease-in-out duration-300 [&:popover-open]:opacity-100 [&:popover-open]:scale-100"
            >
                <div className="my-5">
                    {/* Header */}
                    <div className="mx-4 flex justify-between items-center">
                        <h1 className="tracking-wider text-lg">Add Amenities</h1>
                        <button
                        popoverTarget="modal-amenities"
                        popoverTargetAction="hide"
                        >
                        <IoClose className="size-6 cursor-pointer active:scale-110 active:bg-gray-200 rounded-full transition-colors ease-in-out duration-200" />
                        </button>
                    </div>

                    <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex mt-3" />

                    {/* Form */}
                    <form action={formAction} className="mx-4 my-3 space-y-3">
                    {/* Tombol tambah input */}
                        {fields.length < MAX_INPUTS && (
                        <button
                            type="button"
                            onClick={addField}
                            className="flex items-center gap-1 text-sm bg-primary hover:bg-primary-hover active:scale-105 text-white rounded-sm px-3 py-2 w-max justify-center transition-colors mr-7"
                        >
                            <IoAdd className="size-4" />
                            Add another
                            <span className="text-gray-200/50 ml-1">
                            ({fields.length}/5)
                            </span>
                        </button>
                        )}

                        {fields.map((value, index) => (
                            <div key={index} className="flex items-center gap-2 mb-6">
                                
                                {/* Input */}
                                <div className="relative flex-1">
                                <input
                                    type="text"
                                    name="amenities"
                                    value={value}
                                    onChange={e => updateField(index, e.target.value)}
                                    placeholder=""
                                    className="peer w-full py-2.5 pl-4 pr-4 rounded-lg border bg-white outline-none transition-all"
                                    required
                                />
                                <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-500
                                    peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 transition-all">
                                    Name
                                </label>
                                </div>
                                {/* Tombol hapus */}
                                <button
                                type="button"
                                onClick={() => removeField(index)}
                                disabled={fields.length === 1}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                <IoRemove className="size-5" />
                                </button>
                            </div>
                        ))}

                        {/* Error */}
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-1 block">
                                {state?.error?.amenities}
                            </span>
                        </div>

                        <SubmitButton isPending={isPending} />
                    </form>
                </div>
            </div>
        </div>
        ) 
}

export default ModalCreateAmenities