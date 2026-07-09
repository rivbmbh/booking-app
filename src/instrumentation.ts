export async function register() {
 console.log("✅ instrumentation register() called, runtime:", process.env.NEXT_RUNTIME);    // Hanya jalankan di server side, bukan edge runtime
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { initCronJobs } = await import("./lib/cron");
        initCronJobs();
    }
}