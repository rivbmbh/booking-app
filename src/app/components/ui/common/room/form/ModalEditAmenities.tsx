import { IoClose } from "react-icons/io5"
import SubmitButton from "../button/SubmitButton"
import { updateAmenity } from "@/lib/action"
import { useActionState, useEffect, useState } from "react"
import Swal from "sweetalert2"

const ModalEditAmenities = ({id, name}: {id: string, name: string}) => {
    const [inputValue, setInputValue] = useState(name) 

    const [state, formAction, isPending] = useActionState(
        updateAmenity.bind(null, id),
        null
    )

    useEffect(() => {
        if (state?.success) {
            document.getElementById("modal-amenities-edit")?.hidePopover()
            Swal.fire({
                icon: 'success',
                title: 'Amenities Successfully Changed',
                text: `Successfully changed amenities`,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
            });
        }
    }, [state])

    return (
        <div>
            {/* <button
            popoverTarget="modal-amenities-edit"
            className="rounded-sm p-1 hover:bg-gray-200"
            >
                <IoPencilOutline className="size-5" />            
            </button> */}

            <div
                popover="auto"
                id="modal-amenities-edit"
                className="bg-white shadow-2xl w-[30%] h-max fixed mx-auto top-20 rounded-md opacity-0 scale-95 transition-discrete ease-in-out duration-300 [&:popover-open]:opacity-100 [&:popover-open]:scale-100"
                >
                    <div className="my-5">
                        {/* Header */}
                        <div className="mx-4 flex justify-between items-center">
                            <h1 className="tracking-wider text-lg">Edit Amenities</h1>
                            <button
                            popoverTarget="modal-amenities-edit"
                            popoverTargetAction="hide"
                            >
                            <IoClose className="size-6 cursor-pointer active:scale-110 active:bg-gray-200 rounded-full transition-colors ease-in-out duration-200" />
                            </button>
                        </div>

                        <div className="w-full mx-auto h-0.5 bg-gray-200 relative inline-flex mt-3" />

                        {/* Form */}
                        <form action={formAction} className="mx-4 my-3 space-y-3">
                                <div className="flex items-center gap-2 mb-6">
                                    {/* Input */}
                                    <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}                                        placeholder=""
                                        className="peer w-full py-2.5 pl-4 pr-4 rounded-lg border bg-white outline-none transition-all"
                                        required
                                    />
                                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-500
                                        peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                                        peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 transition-all">
                                        Name
                                    </label>
                                    </div>
                                </div>

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

export default ModalEditAmenities