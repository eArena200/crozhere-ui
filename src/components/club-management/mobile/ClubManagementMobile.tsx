'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchClubIdsForAdminId,
  createNewClub,
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import CMMobileHeader from '@/components/club-management/mobile/CMMobileHeader';
import ClubDetailsMobile from '@/components/club-management/mobile/ClubDetailsMobile';
import { ClubFormData } from '@/components/club-management/ClubForm';
import { useParams } from 'next/navigation';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import StationDetails from '@/components/club-management/mobile/StationDetails';

function ClubManagementMobile() {
  const dispatchRedux = useDispatchRedux();

  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string);
  const authAdminId = useSelector(selectAuthRoleBasedId);

  const [isCreateClubDialogOpen, setIsCreateClubDialogOpen] = useState(false);

  useEffect(() => {
    if (authAdminId && paramAdminId === authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId());
    }
  }, [dispatchRedux, paramAdminId, authAdminId]);

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
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-2">
      <CMMobileHeader onClickCreateNewClub={() => setIsCreateClubDialogOpen(true)}/>
      <ClubDetailsMobile />
      <StationDetails />
      <CreateClubDialog
        isOpen={isCreateClubDialogOpen}
        onClose={() => setIsCreateClubDialogOpen(false)}
        onSubmit={handleCreateClub}
      />
    </div>
  );
}

export default ClubManagementMobile;
