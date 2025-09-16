'use client';

import React from 'react';
import { Building2, ChevronDown, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  selectClubManagementState, 
  setSelectedClubAndFetchDetails 
} from '@/redux/slices/club/management/clubManagementSlice';

interface CMMobileHeaderProps {
  onClickCreateNewClub: () => void;
}

function CMMobileHeader({onClickCreateNewClub}: CMMobileHeaderProps) {
  const dispatchRedux = useDispatchRedux();
  const { clubList, selectedClubId } = useSelector(selectClubManagementState);

  const handleClubSelect = (clubId: number) => {
      dispatchRedux(setSelectedClubAndFetchDetails(clubId));
    };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 h-16 flex items-center justify-between">
        {/* Club Dropdown or Page-description */}
        {
          clubList.length > 0 ? (
            <div className="relative">
              <select
                value={selectedClubId || ''}
                onChange={(e) => handleClubSelect(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-sm px-4 py-1.5 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {clubList.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          ) : (
            <div className="w-full flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-md font-semibold text-gray-900 tracking-tight">Manage Clubs</h1>
                <p className="text-xs text-gray-500">View and manage your gaming clubs</p>
              </div>
            </div>
          )
        }

        {/* Add Club Button */}
        <Button 
          variant="m_primary"
          onClick={onClickCreateNewClub}
          className="flex items-center space-x-2 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Plus className="w-4 h-4" />
          <span className='text-sm font-medium'>Register New</span>
        </Button>
    </div>
  );
}

export default CMMobileHeader;
