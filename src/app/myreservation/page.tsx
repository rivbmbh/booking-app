import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ListReservation from "../components/ui/common/myreservation/ListReservation";

export const metadata: Metadata = {
  title: "My Reservation",
};

const MyReservationPage = async () => {
  const session = await auth();
  if (!session || !session.user) redirect("/signin");
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto mt-10 py-20 px-4">
        <div className="flex flex-col w-[90%] mx-auto">
          <div className="rounded-sm">
            <ListReservation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReservationPage;
