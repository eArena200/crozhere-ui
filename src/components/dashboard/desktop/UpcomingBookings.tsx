'use client';

import React, { useEffect, useState } from 'react';
import BookingListItem from './UpcomingBookingListItem';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  fetchUpcomingBookings,
  selectUpcomingBookingsMap,
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BookingDetailsResponse } from '@/api/booking/model';

export default function UpcomingBookings({ clubId }: { clubId: number }) {
  const dispatchRedux = useDispatchRedux();
  const upcomingBookings = useSelector(selectUpcomingBookingsMap);

  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsResponse | null>(null);

  useEffect(() => {
    if (clubId) {
      dispatchRedux(fetchUpcomingBookings({ clubId }));
    }
  }, [dispatchRedux, clubId]);

  return (
    <div className="bg-white border-2 border-gray-300 rounded shadow h-full w-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 rounded-t p-2 flex items-center justify-center">
        <h2 className="text-md font-bold text-white">Upcoming Bookings</h2>
      </div>

      {/* List */}
      <div className="bg-white overflow-y-auto flex-1 space-y-2 p-2">
        {Object.entries(upcomingBookings).map(([bookingId, booking]) => (
          <div
            key={bookingId}
            onClick={() => setSelectedBooking(booking)}
            className="cursor-pointer hover:bg-gray-100 rounded"
          >
            <BookingListItem
              playerName={booking.player.name}
              contact={booking.player.playerPhoneNumber}
              startTime={booking.booking.startTime}
              endTime={booking.booking.endTime}
              stationType={booking.booking.stationType}
              players={booking.booking.totalPlayers}
            />
          </div>
        ))}
      </div>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        className="relative z-70"
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Booking Summary
              </Dialog.Title>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 flex-1">
              {selectedBooking && (
                <div className="space-y-6">
                  {/* Player Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                      Player Details
                    </h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="font-medium text-gray-600">Name</dt>
                      <dd className="text-gray-900">{selectedBooking.player.name}</dd>
                      <dt className="font-medium text-gray-600">Contact</dt>
                      <dd className="text-gray-900">
                        {selectedBooking.player.playerPhoneNumber}
                      </dd>
                    </dl>
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                      Booking Details
                    </h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="font-medium text-gray-600">Station Type</dt>
                      <dd className="text-gray-900">
                        {selectedBooking.booking.stationType}
                      </dd>
                      <dt className="font-medium text-gray-600">Players</dt>
                      <dd className="text-gray-900">
                        {selectedBooking.booking.totalPlayers}
                      </dd>
                      <dt className="font-medium text-gray-600">Start Time</dt>
                      <dd className="text-gray-900">
                        {selectedBooking.booking.startTime}
                      </dd>
                      <dt className="font-medium text-gray-600">End Time</dt>
                      <dd className="text-gray-900">
                        {selectedBooking.booking.endTime}
                      </dd>
                    </dl>
                  </div>

                  {/* Cost Details */}
                  {selectedBooking.booking.costDetails && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                        Cost Details
                      </h3>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="font-medium text-gray-600">Total Cost</dt>
                        <dd className="text-gray-900 font-bold">
                          ₹{selectedBooking.booking.costDetails.totalCost}
                        </dd>
                      </dl>

                      {/* Cost Breakup */}
                      <div className="mt-4 space-y-4">
                        {selectedBooking.booking.costDetails.costBreakup.map((breakup, idx) => (
                          <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                            <h4 className="font-semibold text-gray-700">
                              {breakup.category} — ₹{breakup.cost}
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                              {breakup.details.map((item, j) => (
                                <li key={j} className="flex justify-between">
                                  <span>
                                    {item.subCategory} ({item.qty} {item.qtyUnit} × ₹
                                    {item.rate}/{item.rateUnit})
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    ₹{item.amount}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
