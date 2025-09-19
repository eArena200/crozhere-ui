'use client';

import { BookingDetailsResponse } from '@/api/booking/model';
import { toReadableDateTime } from '@/lib/date-time-util';
import React from 'react';

interface BookingSummaryMobileProps {
  booking: BookingDetailsResponse
}

function BookingSummaryMobile({ booking }: BookingSummaryMobileProps) {
  return (
    <div className="overflow-y-auto p-2 flex-1 space-y-2">
      {/* Player Info */}
      <div className='border-2 border-blue-300 rounded-md p-2 shadow-md shadow-blue-200'>
        <h3 className="text-center text-sm font-semibold text-gray-800 pb-2 mb-1">
          Player Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <dt className="font-medium text-gray-600">Name</dt>
          <dd className="text-gray-900">{booking.player.name}</dd>

          <dt className="font-medium text-gray-600">Contact</dt>
          <dd className="text-gray-900">
              {booking.player.playerPhoneNumber}
          </dd>
        </dl>
      </div>

        {/* Booking Info */}
      <div className='border-2 border-blue-300 rounded-md p-2 shadow-md shadow-blue-200'>
          <h3 className="text-center text-sm font-semibold text-gray-800 pb-2 mb-1">
            Booking Details
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <dt className="font-medium text-gray-600">Station Type</dt>
          <dd className="text-gray-900">
              {booking.booking.stationType}
          </dd>
          <dt className="font-medium text-gray-600">Players</dt>
          <dd className="text-gray-900">
              {booking.booking.totalPlayers}
          </dd>
          <dt className="font-medium text-gray-600">Start Time</dt>
          <dd className="text-gray-900">
              {toReadableDateTime(booking.booking.startTime, true)}
          </dd>
          <dt className="font-medium text-gray-600">End Time</dt>
          <dd className="text-gray-900">
              {toReadableDateTime(booking.booking.endTime, true)}
          </dd>
          </dl>
      </div>
      <div className='border-2 border-blue-300 rounded-md p-2 shadow-md shadow-blue-200'>
        <h3 className="text-center text-sm font-semibold text-gray-800 pb-2 mb-1">
            Amount Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <dt className="font-medium text-gray-800">Total Amount</dt>
            <dd className="text-gray-900 font-semibold text-end">
              ₹{booking.booking.costDetails.totalCost}
            </dd>
        </dl>

        {/* Cost Breakup */}
        <div className="mt-4 space-y-4">
          {booking.booking.costDetails.costBreakup.map((breakup, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <h4 className="font-medium text-gray-700 text-xs">
                  {breakup.category} — ₹{breakup.cost}
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  {breakup.details.map((item, j) => (
                      <li key={j} className="flex justify-between">
                        <div className='flex flex-col justify-start'>
                          <span>
                            {item.subCategory}
                          </span>
                          <span>
                          ({item.qty} {item.qtyUnit} × ₹ {item.rate}/{item.rateUnit})
                        </span>
                        </div>
                        <span className="font-mono text-gray-900 text-center">
                            ₹{item.amount}
                        </span>
                      </li>
                  ))}
                </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookingSummaryMobile;