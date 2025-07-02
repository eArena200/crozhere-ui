'use client';

import React from 'react';
import { BookingResponse } from '@/api/clubBookingApi';

type BookingsListProps = {
  bookings: BookingResponse[];
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
          <div className="font-medium">Player ID: {booking.playerId}</div>
          <div className="text-sm text-gray-600">Stations: {booking.stationIds.join(', ')}</div>
          <div className="text-xs text-gray-500">From: {booking.startTime}</div>
          <div className="text-xs text-gray-500">To: {booking.endTime}</div>
        </div>
      ))}
    </div>
  );
}

export default BookingsList;
