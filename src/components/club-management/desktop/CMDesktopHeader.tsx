'use client';

import React from 'react';
import { Building2, Plus, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { 
  selectClubManagementState,
  setSelectedClubAndFetchDetails
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';

interface CMDesktopHeaderProps {
  onClickCreateNewClub: () => void;
}

function CMDesktopHeader({ onClickCreateNewClub }: CMDesktopHeaderProps) {
  const dispatchRedux = useDispatchRedux();
  const { clubList, selectedClubId } = useSelector(selectClubManagementState);

  const handleClubSelect = (clubId: number) => {
    dispatchRedux(setSelectedClubAndFetchDetails(clubId));
  };

  return (
    <div className="flex-shrink-0 flex items-center justify-between w-full px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Clubs</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage your gaming clubs</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Club Dropdown */}
        {
          clubList.length > 0 && (
             <div className="relative">
              <select
                value={selectedClubId || ''}
                onChange={(e) => handleClubSelect(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {clubList.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )
        }

        {/* Add Club Button */}
        <Button 
          variant="primary"
          onClick={onClickCreateNewClub}
          className="flex items-center space-x-2 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Club</span>
        </Button>
      </div>
    </div>
  );
}

export default CMDesktopHeader; 