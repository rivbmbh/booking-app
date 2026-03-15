"use client";
import { bookingProps } from "@/types/booking";
import { useTransition } from "react";

/*
Ini TypeScript declaration supaya:
TypeScript tahu bahwa window.snap benar-benar ada
Biasanya berasal dari Midtrans Snap JS
 */
declare global {
  interface Window {
    snap: {
      pay: (token: string) => void;
    };
  }
}

function PaymentButoon({ booking }: { booking: bookingProps }) {
  const [isPending, startTransition] = useTransition();
  const handlePayment = async () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify(booking),
        });
        const { token } = await response.json();
        if (token) {
          window.snap.pay(token);
        }
      } catch (error) {
        console.info(error);
      }
    });
  };
  return (
    <button
      onClick={handlePayment}
      className="px-10 py-3 mt-2 text-center font-semibold text-white w-full bg-primary rounded-lg hover:bg-primary-hover cursor-pointer"
    >
      {isPending ? "Processing..." : "Process Payment"}
    </button>
  );
}

export default PaymentButoon;
