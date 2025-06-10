'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatchRedux } from '@/redux/store';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import ClubDetails from './ClubDetails';
import StationDetails from './StationDetails';
import { ClubFormData } from '../CreateOrEditClubForm';
import { 
  createNewClub,
  fetchClubIdsForAdminId,
  fetchStationsByClubId,
  selectClubManagementState 
} from '@/redux/slices/club/clubManagementSlice';
import { useSelector } from 'react-redux';
import { selectAuthClubAdminId } from '@/redux/slices/auth/authSlice';
import CMDesktopHeader from './CMDesktopHeader';
import { CreateClubRequest } from '@/api/clubManagementApi';

function ClubManagementDesktop() {
  const dispatchRedux = useDispatchRedux();

  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string)
  const authAdminId = useSelector(selectAuthClubAdminId);
  const { selectedClubId } = useSelector(selectClubManagementState);

  useEffect(() => {
    if (paramAdminId === authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId(paramAdminId));
    }
  }, [dispatchRedux, paramAdminId, authAdminId]);

  useEffect(() => {
    if (selectedClubId) {
      dispatchRedux(fetchStationsByClubId(selectedClubId));
    }
  }, [dispatchRedux, selectedClubId]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!authAdminId || paramAdminId !== authAdminId) {
    // TODO: Add an unauthorized page
    return (
      <div>Unauthorized</div>
    );
  }

  const handleCreateClub = (clubData: ClubFormData) => {
    dispatchRedux(createNewClub({
      clubAdminId: authAdminId,
      clubFormData: clubData
    }));
  }

  return (
    <div className="flex flex-col bg-gray-50 w-full">
      <CMDesktopHeader onClickCreateNewClub={() => setIsDialogOpen(true)} />

      <div className="flex flex-col w-full p-2 gap-2">
        <div className="w-full">
          <ClubDetails />
          <StationDetails />
        </div>
      </div>

      {/* Create Club Dialog */}
      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateClub}
      />
    </div>
  );
}

export default ClubManagementDesktop;
