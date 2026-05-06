"use client";
import { saveRoom } from "@/lib/action";
import { useActionState } from "react";
import SubmitButton from "../button/SubmitButton";


const CreateAmenitiesForm = () => {
    const [state, formAction, isPending] = useActionState(
    saveRoom.bind(null),
    null
  );
  return (
    <form action={formAction}>
        <div className="flex justify-start  w-full max-w-screen-2xl">
            <div className="w-4/6 bg-white p-4">

            <div className="mb-4">
            <div className="relative">

                <input
                type="text"
                name="amenities"
                placeholder=""
                className={`peer w-full py-2.5 pl-8 pr-4 rounded-lg border bg-white outline-none transition-all
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                ${state?.error?.roomNumber
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}
                `}
                required
                />

                {/* Floating label */}
                <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-gray-500
                peer-placeholder-shown:top-2.5
                peer-placeholder-shown:text-sm
                peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5
                peer-focus:text-xs
                peer-focus:text-blue-600
                transition-all">
                Name
                </label>
            </div>

            {/* Error message */}
            <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500 mt-2 block">
                {state?.error?.roomNumber}
                </span>
            </div>
            </div>

            <SubmitButton isPending={isPending} />
            </div>
        </div>
    </form>
);
};

export default CreateAmenitiesForm;
