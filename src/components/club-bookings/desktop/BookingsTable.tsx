'use client';

import React, { useState, Fragment } from "react";
import { useDispatchRedux } from "@/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { toReadableDateTime } from "@/lib/date-time-util";
import { BookingsColumn, BookingsPagination, BookingStatus } from "@/lib/types/bookings";
import { goToPage, setPageSize } from "@/redux/slices/club/booking/clubBookingsListSlice";
import BookingDetailsCard from "@/components/club-bookings/BookingDetailsCard";
import PaginationFooter from "@/components/club-bookings/PaginationFooter";
import { BookingDetailsResponse, BookingStationDetails } from "@/api/booking/model";


interface BookingsTableProps {
  viewColumns: BookingsColumn[];
  paginationState: BookingsPagination;
  bookings: BookingDetailsResponse[];
}

function BookingsTable({ bookings, paginationState,  viewColumns }: BookingsTableProps) {
  const dispatch = useDispatchRedux();

  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsResponse | null>(null);

  const handlePageChange = (page: number) => {
    dispatch(goToPage(page));
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
  }

  const renderCell = (booking: BookingDetailsResponse, column: BookingsColumn) => {
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
        return toReadableDateTime(booking.booking.startTime, true);
      case BookingsColumn.END_TIME:
        return toReadableDateTime(booking.booking.endTime, true);
      case BookingsColumn.PLAYER_COUNT:
        return booking.booking.totalPlayers;
      case BookingsColumn.BOOKING_AMOUNT:
        return `₹ ${booking.booking.costDetails.totalCost}`;
      case BookingsColumn.BOOKING_STATUS:
        return booking.booking.bookingStatus;
      default:
        return null;
    }
  };

  const columnLabels: Record<BookingsColumn, string> = {
    [BookingsColumn.PLAYER_ID]: "Player ID",
    [BookingsColumn.PLAYER_NAME]: "Player",
    [BookingsColumn.PLAYER_PHONE_NUMBER]: "Phone Number",
    [BookingsColumn.STATION_TYPE]: "Station Type",
    [BookingsColumn.STATIONS]: "Stations",
    [BookingsColumn.START_TIME]: "Start",
    [BookingsColumn.END_TIME]: "End",
    [BookingsColumn.PLAYER_COUNT]: "Players",
    [BookingsColumn.BOOKING_AMOUNT]: "Amount",
    [BookingsColumn.BOOKING_STATUS]: "Status"
  };

  return (
    <div>
      <div className="overflow-auto border rounded shadow-sm max-w-screen max-h-screen mx-2 my-2">
        <table className="text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-xs uppercase tracking-normal text-white">
            <tr>
              {viewColumns.map((col) => (
                <th key={col} className="px-4 py-3">
                  {columnLabels[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((bookingDetails) => (
              <tr
                key={bookingDetails.bookingId}
                className="hover:bg-blue-200 cursor-pointer"
                onClick={() => setSelectedBooking(bookingDetails)}
              >
                {viewColumns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {renderCell(bookingDetails, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            
      <div className="px-2 py-1">
        <PaginationFooter 
          currentPage={paginationState.page} 
          pageSize={paginationState.pageSize} 
          totalPages={paginationState.totalPages} 
          onPageChange={handlePageChange} 
          onPageSizeChange={handlePageSizeChange} 
        />
      </div>
   
      {/* Booking Details Dialog */}
      <Transition appear show={!!selectedBooking} as={Fragment}>
        <Dialog as="div" className="relative z-70" onClose={() => setSelectedBooking(null)}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  {selectedBooking && (
                    <>
                      {/* Title + Close Button */}
                      <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Booking Details
                        </Dialog.Title>
                        <button
                          onClick={() => setSelectedBooking(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Booking Details Card */}
                      <BookingDetailsCard booking={selectedBooking} />
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

function getFormattedStation(stations: BookingStationDetails[]): string {
  return stations
    .map((stn) => `${stn.stationName}${stn.playerCount > 1 ? ` (${stn.playerCount})` : ""}`)
    .join(", ");
}

export default BookingsTable;
