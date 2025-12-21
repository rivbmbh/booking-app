"use client";
import { reservationProps } from "@/types/reservation";
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

function PaymentButoon({ reservation }: { reservation: reservationProps }) {
  const [isPending, startTransition] = useTransition();
  const handlePayment = async () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify(reservation),
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
      className="px-10 py-4 mt-2 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-600 cursor-pointer"
    >
      Process Payment
    </button>
  );
}

export default PaymentButoon;
