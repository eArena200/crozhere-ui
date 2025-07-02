import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { ClubResponse } from '@/api/clubManagementApi';

interface CBDesktopHeaderProps {
  clubList: ClubResponse[];
  selectedClubId: number | null;
  onClubChange: (clubId: number) => void;
}

function CBDesktopHeader({ clubList, selectedClubId, onClubChange }: CBDesktopHeaderProps) {
  const handleClubSelect = (clubId: number) => {
    onClubChange(clubId);
  };

  return (
    <div className="flex-shrink-0 flex items-center justify-between w-full px-8 py-5 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">View Bookings</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Club Dropdown */}
        <div className="relative">
          <select
            value={selectedClubId ?? ''}
            onChange={(e) => handleClubSelect(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a club</option>
            {clubList.map((club) => (
              <option key={club.clubId} value={club.clubId}>
                {club.clubName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default CBDesktopHeader;
