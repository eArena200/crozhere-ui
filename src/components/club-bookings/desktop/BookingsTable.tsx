'use client';

import { BookingDetailsResponse, BookingStationDetails } from '@/api/booking/model';
import { toReadableDateTime } from '@/lib/date-time-util';
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface BookingsTableProps {
  bookings: BookingDetailsResponse[];
}

function BookingsTable({ bookings }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsResponse | null>(null);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bookings found for the selected filters.
      </div>
    );
  }

  return (
    <>
      {/* Bookings Table */}
      <div className="overflow-auto border rounded shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-xs uppercase tracking-wider text-white">
            <tr>
              <th className="px-4 py-3">Station Type</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Stations</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Players</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((bookingDetails) => (
              <tr
                key={bookingDetails.bookingId}
                className="hover:bg-blue-200 cursor-pointer"
                onClick={() => setSelectedBooking(bookingDetails)}
              >
                <td className="px-4 py-2">{bookingDetails.booking.stationType}</td>
                <td className="px-4 py-2">{bookingDetails.player.name}</td>
                <td className="px-4 py-2">{getFormattedStation(bookingDetails.booking.stations)}</td>
                <td className="px-4 py-2">{toReadableDateTime(bookingDetails.booking.startTime, true)}</td>
                <td className="px-4 py-2">{toReadableDateTime(bookingDetails.booking.endTime, true)}</td>
                <td className="px-4 py-2">{bookingDetails.booking.totalPlayers}</td>
                <td className="px-4 py-2">{`₹ ${bookingDetails.booking.costDetails.totalCost}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Dialog */}
      <Transition appear show={!!selectedBooking} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedBooking(null)}>
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

          {/* Dialog Panel */}
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
                      <Dialog.Title className="text-lg font-semibold mb-4 text-black">
                        Booking Details
                      </Dialog.Title>

                      <div className="space-y-4 text-sm text-gray-700">
                        {/* Club */}
                        <div className="border rounded p-3 bg-gray-50">
                          <p><strong>Club:</strong> {selectedBooking.club.clubName}</p>
                          <p><strong>Player:</strong> {selectedBooking.player.name} ({selectedBooking.player.playerPhoneNumber})</p>
                        </div>

                        {/* Booking Info */}
                        <div className="border rounded p-3 bg-white">
                          <p><strong>Station Type:</strong> {selectedBooking.booking.stationType}</p>
                          <p><strong>Start:</strong> {toReadableDateTime(selectedBooking.booking.startTime)}</p>
                          <p><strong>End:</strong> {toReadableDateTime(selectedBooking.booking.endTime)}</p>
                          <p><strong>Players:</strong> {selectedBooking.booking.totalPlayers}</p>
                          <p><strong>Status:</strong> {selectedBooking.booking.bookingStatus}</p>
                          <p><strong>Stations:</strong> {getFormattedStation(selectedBooking.booking.stations)}</p>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="border rounded p-3 bg-gray-50">
                          <p className="font-semibold mb-2">Cost Breakdown</p>
                          {selectedBooking.booking.costDetails.costBreakup.map((c, idx) => (
                            <div key={idx} className="mb-2">
                              {c.details.map((d, i) => (
                                <div key={i} className="flex justify-between">
                                  <span>{d.subCategory} ({d.qty} {d.qtyUnit})</span>
                                  <span>₹ {d.amount}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                          <p className="mt-2 font-bold text-right">Total: ₹ {selectedBooking.booking.costDetails.totalCost}</p>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function getFormattedStation(stations: BookingStationDetails[]): string {
  return stations
    .map(stn => `${stn.stationName}${stn.playerCount > 1 ? ` (${stn.playerCount})` : ''}`)
    .join(', ');
}

export default BookingsTable;
