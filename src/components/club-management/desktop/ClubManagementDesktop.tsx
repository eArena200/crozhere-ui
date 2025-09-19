'use client';

import React, { useEffect, useState } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  createNewClub,
  fetchClubIdsForAdminId,
  selectClubManagementState
} from '@/redux/slices/club/management/clubManagementSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CreateClubDialog from '@/components/club-management/components/dialog/CreateClubDialog';
import { ClubFormData } from '@/components/club-management/components/forms/ClubForm';
import CMDesktopHeader from '@/components/club-management/desktop/CMDesktopHeader';
import CMDesktopBody from '@/components/club-management/desktop/CMDesktopBody';
import UnAuthorized from '@/components/ui/UnAuthorized';


function ClubManagementDesktop() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);

  const {
    createClubLoading,
    createClubError
  } = useSelector(selectClubManagementState)

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
    <div className="flex flex-col h-full min-h-screen bg-white w-full">
      <CMDesktopHeader onClickCreateNewClub={() => setIsCreateClubDialogOpen(true)} />
      <CMDesktopBody />
      <CreateClubDialog
        isOpen={isCreateClubDialogOpen}
        onClose={() => setIsCreateClubDialogOpen(false)}
        onSubmit={handleCreateClub}
        loading={createClubLoading}
        error={createClubError}
      />
    </div>
  );
}

export default ClubManagementDesktop;
