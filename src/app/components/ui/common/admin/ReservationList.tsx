import React from 'react'
import { getReservation, getRoomTypeOptions } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SearchFilterBar from '../room/form/SearchFilterBar';
import SortButton from '../room/button/SortButton';
import { BookingStatus } from '@prisma/client';
import CancelReservation from '../room/button/CancelReservation';
import { FaFilePdf } from 'react-icons/fa6';
import DownloadOrderSummaryButton from '../DownloadOrderSummaryButton';

type Props = {
  searchParams: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    floor?: string;
    roomTypeId?: string;
  };
};

const ReservationList = async ({ searchParams }: Props) => {
  const {
    sortBy = "updatedAt",
    sortOrder = "desc",
    search = "",
    floor = "all",
    roomTypeId = "all",
  } = await searchParams;

  const [reservation, roomTypeOptions] = await Promise.all([
    getReservation(sortBy, sortOrder, search, floor, roomTypeId),
    getRoomTypeOptions(),
  ]);

  return (
    <div className="bg-white p-4 mt-5 shadow-sm">
      <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">
        <SearchFilterBar roomTypeOptions={roomTypeOptions ?? []} />
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-1 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">Name</th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">Room Type</th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Floor" field="floor" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Room Number" field="roomNumber" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Arrival" field="startDate" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                <SortButton label="Departure" field="endDate" />
              </th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">Payment Status</th>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!reservation?.length ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-10">
                  No reservations match your filter.
                </td>
              </tr>
            ) : (
              reservation.map((res) => (
                <tr key={res.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4">{res.guestName ?? res.Booking?.User?.name}</td>
                  <td className="px-6 py-4">{res.Room?.RoomType?.name}</td>
                  <td className="px-6 py-4">{res.Room?.floor}</td>
                  <td className="px-6 py-4">{res.Room?.roomNumber}</td>
                  <td className="px-6 py-4">{formatDate(res.startDate.toISOString())}</td>
                  <td className="px-6 py-4">{formatDate(res.endDate.toISOString())}</td>
                  <td
                    className={`px-6 py-4 uppercase tracking-widest ${
                      res.Booking?.status === BookingStatus.CONFIRMED || res.Booking?.status === BookingStatus.PENDING
                        ? ""
                        : "text-primary font-semibold"
                    }`}
                  >
                    {res.Booking?.Payment?.status ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-center items-center gap-1.5">
                      {/* <button className="underline active:scale-105 text-black font-semibold text-sm tracking-widest">
                        <FaFilePdf className="size-4" />
                      </button> */}
                      <DownloadOrderSummaryButton bookingId={res.bookingId} />
                      <span className="text-gray-800 px-2">|</span>
                      <CancelReservation id={res.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;