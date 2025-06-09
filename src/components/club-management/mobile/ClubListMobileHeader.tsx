'use client';

import React from 'react';
import ClubListDropDownList from './ClubListDropDownList';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ClubListMobileHeaderProps {
  clubList: {
    clubId: number;
    clubName: string;
  }[];
  selectedClubId: number | undefined;
  onClubSelect: (clubId: number) => void;
  onAddClub: () => void;
}

function ClubListMobileHeader({
  clubList,
  selectedClubId,
  onClubSelect,
  onAddClub,
}: ClubListMobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-70 bg-white shadow-md px-4 h-16 flex items-center">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <ClubListDropDownList
            clubList={clubList}
            selectedClubId={selectedClubId}
            onSelect={onClubSelect}
          />
        </div>
        <Button
          variant="primary"
          onClick={onAddClub}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Club</span>
        </Button>
      </div>
    </div>
  );
}

export default ClubListMobileHeader;
