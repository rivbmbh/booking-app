"use client";
import { bookingProps } from "@/types/booking";
import { useTransition } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string) => void;
    };
  }
}

function PaymentButton({ booking }: { booking: bookingProps }) {
  const [isPending, startTransition] = useTransition();

  const isExpiredOrCancelled = booking.status === "EXPIRED" || booking.status === "CANCELLED";

  const handlePayment = async () => {
    // Guard di client side
    if (isExpiredOrCancelled) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify(booking),
        });

        const data = await response.json();

        // Guard dari response API
        if (!response.ok) {
          console.error(data.error);
          return;
        }

        if (data.token) {
          window.snap.pay(data.token);
        }
      } catch (error) {
        console.info(error);
      }
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isPending || isExpiredOrCancelled}  // ← disable jika expired
      className="w-36 h-9 text-[21px] mt-4 min-[380px]:mt-0 tracking-wider bg-primary rounded-md text-white hover:bg-primary-hover active:scale-105 flex justify-center items-center uppercase font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {isPending ? "Processing..." : isExpiredOrCancelled ? "Expired" : "Pay Now"}
    </button>
  );
}

export default PaymentButton;