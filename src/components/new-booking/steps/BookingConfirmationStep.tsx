'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectConfirmationState } from '@/redux/slices/booking/bookingSlice';
import { CheckCircle } from 'lucide-react';
import { toReadableDateTime } from '@/lib/date-time-util';

function BookingConfirmationStep() {
  const { paymentDetails, bookingDetails } = useSelector(selectConfirmationState);

  if (!paymentDetails || !bookingDetails) {
    return (
      <div className="text-gray-500 text-sm">
        No booking or payment details found. Something went wrong.
      </div>
    );
  }

  const { booking, club } = bookingDetails;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="flex items-center gap-3 text-green-600">
        <CheckCircle size={28} />
        <h2 className="text-2xl font-semibold">Booking Successful</h2>
      </div>

      {/* Club Section */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm text-sm text-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Club Details</h3>
        <p><strong>Name:</strong> {club.clubName}</p>
      </div>

      {/* Booking Details Section */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm text-sm text-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Booking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p><strong>Station Type:</strong> {booking.stationType}</p>
            <p><strong>Start Time:</strong> {toReadableDateTime(booking.startTime)}</p>
            <p><strong>End Time:</strong> {toReadableDateTime(booking.endTime)}</p>
          </div>
          <div>
            <p><strong>Stations:</strong></p>
            <ul className="list-disc ml-4">
              {booking.stations.map((s) => (
                <li key={s.stationId}>{s.stationName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm text-sm text-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Payment Details</h3>
        <p><strong>Payment ID:</strong> {paymentDetails.paymentId}</p>
        <p><strong>Status:</strong> {paymentDetails.status}</p>
        <p><strong>Mode:</strong> {paymentDetails.paymentMode}</p>
        <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
      </div>
    </div>
  );
}

export default BookingConfirmationStep;
