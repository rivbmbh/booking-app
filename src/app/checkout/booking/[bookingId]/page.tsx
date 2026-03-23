import BookingPreviewDetail from "@/app/components/ui/common/booking/BookingPreviewDetail";
import ReservationSummarySkeleton from "@/app/components/ui/skeletons/reservation/ReservationSummarySkeleton";
import { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reservation Summary",
};

const BookingPreviewPage = async ({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) => {
  const bookingId = (await params).bookingId;
  return (
    <div className="max-w-screen-2xl px-4 mx-auto py-20 mt-9">
      <h1 className="text-4xl font-bold mb-4 text-center md:text-start">
        Booking Preview
      </h1>
      <Suspense fallback={<ReservationSummarySkeleton />}>
        <BookingPreviewDetail bookingId={bookingId} />
      </Suspense>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
};

export default BookingPreviewPage;
