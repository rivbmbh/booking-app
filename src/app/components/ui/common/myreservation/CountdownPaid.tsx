"use client";

import { useEffect, useState } from "react";

type Props = {
    expiresAt: Date;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
};

    const CountdownPaid = ({ expiresAt, status }: Props) => {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        // Kalau sudah tidak pending, tidak perlu jalankan interval sama sekali
        if (status !== "PENDING") return;

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
    }, [expiresAt, status]);

    // if (status === "CONFIRMED") return <span className="text-green-600 font-semibold">Paid</span>;
    // if (status === "CANCELLED") return <span className="text-red-500 font-semibold">Cancelled</span>;
    // if (status === "EXPIRED") return <span className="text-gray-400 font-semibold">Expired</span>;

    return <>{countdown}</>;
};

export default CountdownPaid;