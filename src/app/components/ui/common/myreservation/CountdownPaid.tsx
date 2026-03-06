"use client";

import { useEffect, useState } from "react";

const CountdownPaid = ({ expiresAt }: { expiresAt: Date }) => {

    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(expiresAt).getTime();

            const diff = target - now;

            if (diff <= 0) {
                setCountdown("00:00:00");
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = (num: number) => num.toString().padStart(2, "0");

            setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);
  return (
    <>
        {countdown}
    </>
  )
}

export default CountdownPaid