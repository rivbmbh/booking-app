import { auth } from "@/auth";
import MyReserveList from "../components/ui/common/myreservation/MyReserveList";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
          <div>
            <h3 className="text-3xl text-left text-gray-900 font-extrabold mt-2">
              Hi, {session.user.name}
            </h3>
            <p className="mt-1 font-medium text-lg mb-2.5">
              Here&apos;s your book history :
            </p>
          </div>
          <div className="rounded-sm">
            <MyReserveList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReservationPage;
