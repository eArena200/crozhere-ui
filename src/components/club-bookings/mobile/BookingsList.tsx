'use client';


import React, { useState, Fragment } from 'react';
import { BookingDetailsResponse, BookingStationDetails } from '@/api/booking/model';
import { BookingsColumn, BookingsPagination } from '@/lib/types/bookings';
import { toReadableDateTime } from '@/lib/date-time-util';
import PaginationFooter from '@/components/club-bookings/PaginationFooter';
import BookingDetailsCard from '@/components/club-bookings/desktop/BookingDetailsCard';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatchRedux } from '@/redux/store';
import { goToPage, setPageSize } from '@/redux/slices/club/booking/clubBookingsListSlice';

type BookingsListProps = {
  bookings: BookingDetailsResponse[];
  paginationState: BookingsPagination;
  viewColumns: BookingsColumn[];
};

export default function BookingsList({ bookings, paginationState, viewColumns }: BookingsListProps) {
  const dispatch = useDispatchRedux();
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsResponse | null>(null);

  const handlePageChange = (page: number) => {
    dispatch(goToPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
  };

  if (bookings.length === 0) {
    return <div className="text-center text-gray-500 mt-6">No bookings found</div>;
  }

  return (
    <div className="space-y-2 p-1">
      {bookings.map((booking) => (
        <div
          key={booking.bookingId}
          className="px-2 py-1 rounded-md border shadow-sm bg-white flex flex-col gap-1 cursor-pointer hover:bg-blue-50 transition"
          onClick={() => setSelectedBooking(booking)}
        >
          {viewColumns.map((col) => {
            const value = renderCell(booking, col);
            return value ? (
              <div key={col} className="flex justify-between text-xs w-full">
                <span className="font-medium text-gray-700">{columnLabels[col]}:</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ) : null;
          })}
        </div>
      ))}

      {/* Pagination */}
      <PaginationFooter
        currentPage={paginationState.page}
        pageSize={paginationState.pageSize}
        totalPages={paginationState.totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Booking Details Dialog (Full-screen on Mobile) */}
      <Transition appear show={!!selectedBooking} as={Fragment}>
        <Dialog as="div" className="relative z-70" onClose={() => setSelectedBooking(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-end sm:items-center sm:justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 sm:scale-100"
              leaveTo="translate-y-full sm:scale-95"
            >
              <Dialog.Panel className="w-full sm:max-w-lg sm:rounded-2xl bg-white p-4 shadow-lg">
                {selectedBooking && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <Dialog.Title className="text-lg font-semibold text-black">Booking Details</Dialog.Title>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedBooking(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <BookingDetailsCard booking={selectedBooking} />
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

function renderCell(booking: BookingDetailsResponse, column: BookingsColumn) {
  switch (column) {
    case BookingsColumn.PLAYER_ID:
      return booking.player.playerId;
    case BookingsColumn.PLAYER_NAME:
      return booking.player.name;
    case BookingsColumn.PLAYER_PHONE_NUMBER:
      return booking.player.playerPhoneNumber;
    case BookingsColumn.STATION_TYPE:
      return booking.booking.stationType;
    case BookingsColumn.STATIONS:
      return getFormattedStation(booking.booking.stations);
    case BookingsColumn.START_TIME:
      return toReadableDateTime(booking.booking.startTime, false);
    case BookingsColumn.END_TIME:
      return toReadableDateTime(booking.booking.endTime, false);
    case BookingsColumn.PLAYER_COUNT:
      return booking.booking.totalPlayers;
    case BookingsColumn.BOOKING_AMOUNT:
      return `₹ ${booking.booking.costDetails.totalCost}`;
    default:
      return null;
  }
}

const columnLabels: Record<BookingsColumn, string> = {
  [BookingsColumn.PLAYER_ID]: "Player ID",
  [BookingsColumn.PLAYER_NAME]: "Player",
  [BookingsColumn.PLAYER_PHONE_NUMBER]: "Phone",
  [BookingsColumn.STATION_TYPE]: "Station Type",
  [BookingsColumn.STATIONS]: "Stations",
  [BookingsColumn.START_TIME]: "Start",
  [BookingsColumn.END_TIME]: "End",
  [BookingsColumn.PLAYER_COUNT]: "Players",
  [BookingsColumn.BOOKING_AMOUNT]: "Amount",
};

function getFormattedStation(stations: BookingStationDetails[]): string {
  return stations
    .map((stn) => `${stn.stationName}${stn.playerCount > 1 ? ` (${stn.playerCount})` : ""}`)
    .join(", ");
}
