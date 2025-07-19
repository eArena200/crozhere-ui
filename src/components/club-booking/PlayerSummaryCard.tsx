'use client';

import React from 'react';
import { User } from 'lucide-react';
import { BookingIntentPlayerDetails } from '@/api/booking/model';

interface PlayerSummaryCardProps {
  player: BookingIntentPlayerDetails;
}

const PlayerSummaryCard: React.FC<PlayerSummaryCardProps> = ({ player }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
      <h2 className="font-semibold text-base mb-3 text-gray-700">Player Details</h2>
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-100 rounded-full">
          <User size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{player.name}</p>
          <p className="text-sm text-gray-600">{player.playerPhoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerSummaryCard;
