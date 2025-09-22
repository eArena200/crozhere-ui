'use client';

import React, { useEffect, useState } from 'react';
import BookingListItem from '@/components/dashboard/desktop/upcoming/UpcomingBookingListItem';
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
import BookingDetailsCard from '@/components/club-bookings/BookingDetailsCard';

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
    <div className="bg-white border-2 border-gray-300 rounded shadow h-full w-full min-h-screen flex flex-col">
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
                <BookingDetailsCard booking={selectedBooking}/>
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
