import { getRevenueAndReserve, getTotalCustomers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { LuChartArea, LuShoppingCart, LuUsers } from "react-icons/lu";

const DashBoardCards = async () => {
  const [data, customer] = await Promise.all([
    getRevenueAndReserve(),
    getTotalCustomers(),
  ]);
  if (!data || !customer) notFound();

  return (
    <div className="grid md:grid-cols-3 gap-5 pb-10 mt-4">
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-primary">
          <LuChartArea className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Reveneu</h3>
          <p>{formatCurrency(data.revenue)}</p>
        </div>
      </div>
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-primary">
          <LuShoppingCart className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Reservation</h3>
          <p>{data.reserve}</p>
        </div>
      </div>
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-primary">
          <LuUsers className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Customers</h3>
          <p>{customer}</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCards;
