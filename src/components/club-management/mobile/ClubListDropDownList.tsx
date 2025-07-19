'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ClubListDropDownListProps {
  clubList: {
    clubId: number;
    clubName: string;
  }[];
  selectedClubId: number | undefined;
  onSelect: (clubId: number) => void;
}

function ClubListDropDownList({ clubList: clubs, selectedClubId, onSelect }: ClubListDropDownListProps) {
  const selectedClub = clubs.find(club => club.clubId === selectedClubId);

  return (
    <div className="relative">
      <div className="relative">
        <select
          className="w-full appearance-none bg-white pl-4 pr-12 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={selectedClubId ?? ''}
          onChange={e => onSelect(Number(e.target.value))}
        >
          <option value="" disabled className="text-gray-500">Select a club</option>
          {clubs.map(club => (
            <option 
              key={club.clubId} 
              value={club.clubId}
              className="py-1"
            >
              {club.clubName}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default ClubListDropDownList;
