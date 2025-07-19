import { BookingDetailsResponse, BookingStationDetails } from '@/api/booking/model';
import { toReadableDateTime } from '@/lib/date-time-util';
import React from 'react';

interface BookingsTableProps {
  bookings: BookingDetailsResponse[];
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
        <thead className="bg-blue-600 text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-4 py-3">Station Type</th>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Stations</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Player Count</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((bookingDetails) => (
            <tr key={bookingDetails.bookingId} className="border-t hover:bg-gray-100">
              <td className="px-4 py-2">{bookingDetails.booking.stationType}</td>
              <td className="px-4 py-2">{bookingDetails.player.name}</td>
              <td className="px-4 py-2">{getFormattedStation(bookingDetails.booking.stations)}
              </td>
              <td className="px-4 py-2">{toReadableDateTime(bookingDetails.booking.startTime, true)}</td>
              <td className="px-4 py-2">{toReadableDateTime(bookingDetails.booking.endTime, true)}</td>
              <td className="px-4 py-2">{bookingDetails.booking.totalPlayers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getFormattedStation(stations: BookingStationDetails[]): string {
  return stations.map(stn => {
    return `${stn.stationName} ${stn.playerCount > 1 ? `(${stn.playerCount})` : ''}`
  }).join(', ');
}

export default BookingsTable;
