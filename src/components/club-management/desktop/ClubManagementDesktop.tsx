'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatchRedux } from '@/redux/store';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import ClubDetails from '@/components/club-management/desktop/ClubDetails';
import StationDetails from '@/components/club-management/desktop/StationDetails';
import { ClubFormData } from '@/components/club-management/ClubForm';
import { 
  createNewClub,
  fetchClubIdsForAdminId
} from '@/redux/slices/club/clubManagementSlice';
import { useSelector } from 'react-redux';
import { selectAuthClubAdminId } from '@/redux/slices/auth/authSlice';
import CMDesktopHeader from '@/components/club-management/desktop/CMDesktopHeader';

function ClubManagementDesktop() {
  const dispatchRedux = useDispatchRedux();

  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string)
  const authAdminId = useSelector(selectAuthClubAdminId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (authAdminId && paramAdminId === authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId(paramAdminId));
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
    <div className="flex flex-col bg-gray-50 w-full">
      <CMDesktopHeader onClickCreateNewClub={() => setIsDialogOpen(true)} />
      <ClubDetails />
      <StationDetails />
    
      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateClub}
      />
    </div>
  );
}

export default ClubManagementDesktop;
