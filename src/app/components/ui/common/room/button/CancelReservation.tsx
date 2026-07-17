"use client";

import { cancelReservation } from "@/lib/action";
import Swal from "sweetalert2";

export default function CancelReservation({ id }: { id: string }) {
    const handleCancel = async () => {
        const result = await Swal.fire({
        icon: "warning",
        title: "Cancel Reservation?",
        text: "Are you sure you want to cancel this reservation?",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        });

        if (!result.isConfirmed) return;

        try {
        await cancelReservation(id);
        Swal.fire({
            icon: "success",
            title: "Reservation Cancelled!",
            text: "The reservation has been successfully cancelled.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3085d6",
        });
        } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Failed to Cancel",
            text: "Something went wrong while cancelling the reservation.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3085d6",
        });
        }
    };

    return (
        <button
        onClick={handleCancel}
        className="underline hover:text-primary-hover active:scale-105 text-primary font-semibold text-sm tracking-widest"
        >
        Cancel
        </button>
    );
}