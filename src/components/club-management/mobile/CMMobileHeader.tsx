'use client';

import React from 'react';
import ClubListDropDownList from './ClubListDropDownList';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  selectClubManagementState, 
  setSelectedClubAndFetchDetails 
} from '@/redux/slices/club/clubManagementSlice';

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
    <div className="fixed top-0 left-0 right-0 z-70 bg-white shadow-md px-4 h-16 flex items-center">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <ClubListDropDownList
            clubList={clubList}
            selectedClubId={selectedClubId}
            onSelect={handleClubSelect}
          />
        </div>
        <Button
          variant="primary"
          onClick={onClickCreateNewClub}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Club</span>
        </Button>
      </div>
    </div>
  );
}

export default CMMobileHeader;
