'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectClubManagementState,
  fetchClubIdsForAdminId,
  setSelectedClubId,
  selectSelectedClubId,
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import ClubListMobileHeader from '@/components/club-management/mobile/ClubListMobileHeader';
import ClubDetailsMobile from '@/components/club-management/mobile/ClubDetailsMobile';
import { selectClubAdminId } from '@/redux/slices/auth/clubAdminSlice';
import CreateOrEditClubForm, { ClubFormData } from '../ClubForm';

function ClubManagementMobile() {
  const dispatch = useDispatchRedux();
  const clubManagementState = useSelector(selectClubManagementState);
  const selectedClubId = useSelector(selectSelectedClubId);
  const clubAdminId = useSelector(selectClubAdminId);
  const [isAddClubDialogOpen, setIsAddClubDialogOpen] = useState(false);

  useEffect(() => {
    if (clubAdminId !== undefined) {
      dispatch(fetchClubIdsForAdminId(clubAdminId));
    }
  }, [dispatch, clubAdminId]);

  const handleClubSelect = (clubId: number) => {
    dispatch(setSelectedClubId(clubId));
  };

  const handleAddClub = (clubData: ClubFormData) => {
    console.log('Adding new club:', clubData);
    // TODO: Implement club creation logic
    setIsAddClubDialogOpen(false);
  };

  return (
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-2">
      <ClubListMobileHeader
        clubList={clubManagementState.clubList}
        selectedClubId={selectedClubId}
        onClubSelect={handleClubSelect}
        onAddClub={() => setIsAddClubDialogOpen(true)}
      />
      {selectedClubId && <ClubDetailsMobile clubId={selectedClubId} />}

      <CreateOrEditClubForm
        isOpen={isAddClubDialogOpen}
        onClose={() => setIsAddClubDialogOpen(false)}
        onSubmit={handleAddClub}
      />
    </div>
  );
}

export default ClubManagementMobile;
