import React from "react";
import {
  LuChartArea,
  LuChartGantt,
  LuShoppingCart,
  LuUsers,
} from "react-icons/lu";

const DashBoardCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-5 pb-10">
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-green-400">
          <LuChartArea className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Reveneu</h3>
          <p>0000</p>
        </div>
      </div>
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-green-400">
          <LuShoppingCart className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Reservation</h3>
          <p>0000</p>
        </div>
      </div>
      <div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-green-400">
          <LuUsers className="size-12 text-white" />
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Total Customers</h3>
          <p>0000</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCards;
