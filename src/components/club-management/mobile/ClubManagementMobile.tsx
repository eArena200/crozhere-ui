'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchClubIdsForAdminId,
  createNewClub,
} from '@/redux/slices/club/management/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import CMMobileHeader from '@/components/club-management/mobile/CMMobileHeader';
import { ClubFormData } from '@/components/club-management/components/forms/ClubForm';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CreateClubDialog from '@/components/club-management/components/dialog/CreateClubDialog';
import UnAuthorized from '@/components/ui/UnAuthorized';
import CMMobileBody from '@/components/club-management/mobile/CMMobileBody';

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
