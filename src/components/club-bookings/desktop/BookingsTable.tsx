import { BookingResponse } from '@/api/clubBookingApi';
import React from 'react';

interface BookingsTableProps {
  bookings: BookingResponse[];
}

function BookingsTable({ bookings }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bookings found for the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-auto border rounded shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3">Booking ID</th>
            <th className="px-4 py-3">Player ID</th>
            <th className="px-4 py-3">Station Type</th>
            <th className="px-4 py-3">Stations</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Player Count</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{booking.bookingId}</td>
              <td className="px-4 py-2">{booking.playerId}</td>
              <td className="px-4 py-2">{booking.stationType}</td>
              <td className="px-4 py-2">{booking.stationIds.join(', ')}</td>
              <td className="px-4 py-2">{formatDate(booking.startTime)}</td>
              <td className="px-4 py-2">{formatDate(booking.endTime)}</td>
              <td className="px-4 py-2">{booking.players}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default BookingsTable;
