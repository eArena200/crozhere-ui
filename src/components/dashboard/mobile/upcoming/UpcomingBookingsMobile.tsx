'use client';

import React, { useEffect, useState } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  fetchUpcomingBookings,
  selectUpcomingBookingsMap,
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { Dialog } from '@headlessui/react';
import { Ticket, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BookingDetailsResponse } from '@/api/booking/model';
import BookingSummaryMobile from '@/components/dashboard/mobile/upcoming/BookingSummaryMobile';
import UpcomingBookingListItemMobile from '@/components/dashboard/mobile/upcoming/UpcomingBookingsListItemMobile';

export default function UpcomingBookingsMobile({ clubId }: { clubId: number }) {
  const dispatchRedux = useDispatchRedux();
  const upcomingBookings = useSelector(selectUpcomingBookingsMap);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsResponse | null>(null);

  useEffect(() => {
    if (clubId) {
      dispatchRedux(fetchUpcomingBookings({ clubId }));
    }
  }, [dispatchRedux, clubId]);

  const upcomingBookingsList = Object.entries(upcomingBookings);

  if(upcomingBookingsList.length == 0){
    return (
      <div className="w-full min-h-[70vh] bg-white flex flex-col gap-2 items-center justify-center">
        <Ticket size={100} className="text-gray-400" />
        <p className="text-gray-500 text-lg">No upcoming bookings</p>
      </div>
    );
  }     

  return (
    <div className="bg-white min-h-screen overflow-y-auto flex-1 space-y-2 p-2">
        {upcomingBookingsList.map(([bookingId, booking]) => (
            <div
            key={bookingId}
            onClick={() => setSelectedBooking(booking)}
            className="cursor-pointer hover:bg-gray-100 rounded"
            >
            <UpcomingBookingListItemMobile
                playerName={booking.player.name}
                contact={booking.player.playerPhoneNumber}
                startTime={booking.booking.startTime}
                endTime={booking.booking.endTime}
                stationType={booking.booking.stationType}
                players={booking.booking.totalPlayers}
            />
            </div>
        ))}
        {/* Booking Details Dialog */}
        <Dialog
            open={!!selectedBooking}
            onClose={() => setSelectedBooking(null)}
            className="relative z-70"
        >
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

            {/* Panel */}
            <div className="fixed inset-0 flex items-center justify-center p-1">
            <Dialog.Panel className="mx-auto w-full max-w-xl rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
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
                {
                    selectedBooking && <BookingSummaryMobile booking={selectedBooking} />
                }

                {/* Footer */}
                <div className="border-t px-4 py-2 flex justify-end">
                    <Button variant="m_secondary" onClick={() => setSelectedBooking(null)}>
                        Close
                    </Button>
                </div>
            </Dialog.Panel>
            </div>
        </Dialog>
    </div>
  );
}
