import cron from "node-cron";

let isInitialized = false;

export function initCronJobs() {
    // Guard supaya tidak double-init saat Next.js hot reload
    if (isInitialized) return;
    isInitialized = true;

    // Jalankan setiap 1 menit
    cron.schedule("* * * * *", async () => {
        try {
        console.log("[CRON] Running expire reservations job...");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/expire-reservations`,
            {
            headers: {
                Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
            }
        );

        const data = await res.json();
        console.log("[CRON] Result:", data);
        } catch (error) {
        console.error("[CRON] Failed:", error);
        }
    });

    console.log("[CRON] Cron jobs initialized");
}