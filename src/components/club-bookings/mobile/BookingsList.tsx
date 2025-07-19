'use client';

import { BookingDetailsResponse } from '@/api/booking/model';
import React from 'react';

type BookingsListProps = {
  bookings: BookingDetailsResponse[];
};

function BookingsList({ bookings }: BookingsListProps) {
  if (bookings.length === 0) {
    return <div className="text-center text-gray-500 mt-6">No bookings found</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.bookingId}
          className="p-4 rounded border shadow-sm bg-gray-50"
        >
          <div className="font-medium">Player : {booking.player.name}</div>
          <div 
            className="text-sm text-gray-600"
          > 
            {booking.booking.stations.map(s => s.stationName).join(', ')}
          </div>
          <div className="text-xs text-gray-500">From: {booking.booking.startTime}</div>
          <div className="text-xs text-gray-500">To: {booking.booking.endTime}</div>
        </div>
      ))}
    </div>
  );
}

export default BookingsList;
