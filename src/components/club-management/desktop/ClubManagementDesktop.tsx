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
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CMDesktopHeader from '@/components/club-management/desktop/CMDesktopHeader';
import RateCardDetails from '@/components/club-management/desktop/RateCardDetails';

function ClubManagementDesktop() {
  const dispatchRedux = useDispatchRedux();

  const authAdminId = useSelector(selectAuthRoleBasedId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId());
    }
  }, [dispatchRedux, authAdminId]);

  if (!authAdminId) {
    return (
      <div>Unauthorized</div>
    );
  }

  const handleCreateClub = (clubData: ClubFormData) => {
    dispatchRedux(createNewClub({
      clubFormData: clubData
    }));
  }

  return (
    <div className="flex flex-col bg-gray-50 w-full">
      <CMDesktopHeader onClickCreateNewClub={() => setIsDialogOpen(true)} />
      <ClubDetails />
      <RateCardDetails />
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
