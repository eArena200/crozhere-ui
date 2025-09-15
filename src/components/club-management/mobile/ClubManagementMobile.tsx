'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchClubIdsForAdminId,
  createNewClub,
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import CMMobileHeader from '@/components/club-management/mobile/CMMobileHeader';
import ClubDetailsMobile from '@/components/club-management/mobile/club/ClubDetailsMobile';
import { ClubFormData } from '@/components/club-management/ClubForm';
import { useParams } from 'next/navigation';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import StationDetails from '@/components/club-management/mobile/station/StationDetailsMobile';
import UnAuthorized from '@/components/ui/UnAuthorized';
import CMMobileBody from './CMMobileBody';

function ClubManagementMobile() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);

  const [isCreateClubDialogOpen, setIsCreateClubDialogOpen] = useState(false);

  useEffect(() => {
    if (authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId());
    }
  }, [dispatchRedux, authAdminId]);

  if (!authAdminId) {
    return <UnAuthorized />;
  }

  const handleCreateClub = (clubData: ClubFormData) => {
    dispatchRedux(createNewClub({ clubFormData: clubData }))
      .unwrap()
      .then(() => {
        setIsCreateClubDialogOpen(false);
      })
      .catch((err) => {
        console.error("Failed to create club:", err);
      });
  };

  return (
    <div className="flex flex-col bg-white w-full min-h-screen text-black">
      <CMMobileHeader onClickCreateNewClub={() => setIsCreateClubDialogOpen(true)}/>
      <CMMobileBody />
      <CreateClubDialog
        isOpen={isCreateClubDialogOpen}
        onClose={() => setIsCreateClubDialogOpen(false)}
        onSubmit={handleCreateClub} loading={false}      />
    </div>
  );
}

export default ClubManagementMobile;
