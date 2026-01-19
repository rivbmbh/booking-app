import CheckoutDetail from "@/app/components/ui/common/checkout/CheckoutDetail";
import ReservationSummarySkeleton from "@/app/components/ui/skeletons/reservation/ReservationSummarySkeleton";
import { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reservation Summary",
};

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const reservationId = (await params).id;
  return (
    <div className="max-w-screen-2xl px-4 mx-auto py-20 mt-9">
      <h1 className="text-4xl font-bold mb-4 text-center md:text-start">
        Reservation Summary
      </h1>
      <Suspense fallback={<ReservationSummarySkeleton />}>
        <CheckoutDetail reservationId={reservationId} />
      </Suspense>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
};

export default CheckoutPage;
