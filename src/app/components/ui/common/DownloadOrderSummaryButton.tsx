"use client";
import { useState } from "react";

const DownloadOrderSummaryButton = ({ bookingId }: { bookingId: string }) => {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDownload() {
        setIsLoading(true);
        try {
        const res = await fetch(`/api/order-summary/${bookingId}`);

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to download");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `order-summary-${bookingId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        } catch (error) {
        console.error(error);
        alert("Gagal download Order Summary. Coba lagi.");
        } finally {
        setIsLoading(false);
        }
    }

    return (
        <button
        onClick={handleDownload}
        disabled={isLoading}
        className="underline active:scale-105 text-black font-semibold text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
        {isLoading ? "Downloading..." : "Download OS"}
        </button>
    );
};

export default DownloadOrderSummaryButton;