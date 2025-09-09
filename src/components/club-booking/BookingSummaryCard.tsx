'use client';

import React from 'react';
import { BookingIntentDetailsResponse } from '@/api/booking/model';
import { Timer, User, Users } from 'lucide-react';
import { toReadableDateTime } from '@/lib/date-time-util';

interface BookingSummaryCardProps {
  intentDetails: BookingIntentDetailsResponse;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ intentDetails }) => {
  const { club, intent } = intentDetails;

  return (
    <div className="border border-gray-300 rounded-md p-3 bg-gray-50 shadow-md space-y-2">
      {/* Club Heading */}
      <h2 className="text-xl font-semibold text-blue-600">{club.clubName}</h2>

      {/* Timing Info */}
      <div className="flex flex-1 items-center text-sm text-gray-700 gap-2">
        <Timer size={20}/>
        <span className="font-medium text-gray-600">{`${toReadableDateTime(intent.startTime, true)}`}</span>
        <span className="font-medium text-gray-600">{'-'}</span>
        <span className="font-medium text-gray-600">{`${toReadableDateTime(intent.endTime, true)}`}</span>
      </div>
      <div className="flex flex-1 items-center text-sm text-gray-700 space-y-1 gap-2">
        {
            intent.totalPlayerCount > 1 ? (<Users size={20}/>) : (<User size={20}/>)
        }
        <span className="font-medium text-gray-600">{intent.totalPlayerCount}</span>
      </div>

      {/* Station Type Card */}
      <div className="flex rounded-md bg-gray-100 shadow-inner border border-gray-200">
        <div className="w-1/6 flex flex-1 items-center justify-center text-md font-medium border-r border-gray-400">
            {intent.stationType}
        </div>

        {/* Station Grid */}
        <div className="w-5/6 grid grid-cols-5 p-2 gap-2 text-sm">
          {intent.stations.map((s) => (
            <div
              key={s.stationId}
              className="bg-blue-600 text-white text-sm rounded-md px-2 py-1 text-center"
            >
                {`${s.stationName} (${s.playerCount}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
