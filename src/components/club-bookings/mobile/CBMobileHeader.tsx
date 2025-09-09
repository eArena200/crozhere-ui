'use client';

import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ClubResponse } from '@/api/club/model';

type CBMobileHeaderProps = {
  clubList: ClubResponse[];
  selectedClubId: number | null;
  onClubChange: (clubId: number) => void;
  onToggleFilter: () => void;
};

function CBMobileHeader({
  clubList,
  selectedClubId,
  onClubChange,
  onToggleFilter,
}: CBMobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-70 bg-white shadow-md px-4 h-16 flex items-center">
        <div className="flex items-center gap-3 w-full">
            <label className="sr-only">Select Club</label>
            <div className="relative w-full">
                <select
                    value={selectedClubId ?? ''}
                    onChange={(e) => onClubChange(Number(e.target.value))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Club</option>
                    {clubList.map((club) => (
                    <option key={club.clubId} value={club.clubId}>
                        {club.clubName}
                    </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <Button 
                variant="primary" 
                onClick={onToggleFilter} 
                className="flex items-center gap-2"
            >
                <span>Filters</span>
                <Filter className="w-4 h-4" />
            </Button>
        </div>
    </div>
  );
}

export default CBMobileHeader;
