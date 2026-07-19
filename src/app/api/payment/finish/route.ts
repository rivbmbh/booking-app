// app/payment/finish/page.tsx
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    order_id?: string;
    status_code?: string;
    transaction_status?: string;
  }>;
};

export default async function PaymentFinishPage({ searchParams }: Props) {
  const { order_id } = await searchParams;

  if (!order_id) {
    redirect("/myreservation");
  }

  // Redirect ke halaman detail booking / my reservations
  // Status sebenarnya tetap divalidasi ulang dari DB (via webhook), bukan dari query param ini
  redirect(`/myreservation?highlight=${order_id}`);
}