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

function PaymentButton({ booking }: { booking: bookingProps }) {
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
    <button onClick={handlePayment} className="w-36 h-9 text-[21px] mt-4 min-[380px]:mt-0 tracking-wider bg-primary rounded-md text-white hover:bg-primary-hover active:scale-105 flex justify-center items-center uppercase font-light">{isPending ? "Processing..." : "Pay Now"}</button>
  );
}

export default PaymentButton;
