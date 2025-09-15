'use client';

import React, { useEffect } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  fetchClubsForAdminId,
  selectClubDashboardState, 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import ClubDashboardHeaderMobile from '@/components/dashboard/mobile/ClubDashBoardHeaderMobile';
import ClubDashboardBodyMobile from '@/components/dashboard/mobile/ClubDashboardBodyMobile';
import UnAuthorized from '@/components/ui/UnAuthorized';

function DashboardMobile() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);
  const { selectedClubId } = useSelector(selectClubDashboardState);

  useEffect(() => {
      if (authAdminId) {
        dispatchRedux(fetchClubsForAdminId());
      }
    }, [dispatchRedux, authAdminId]);

  if (!authAdminId) {
    return (
      <UnAuthorized />
    );
  }

  if(!selectedClubId) {
    return (
      <div className='w-full h-full min-h-[85vh] bg-gray-200 flex flex-1 items-center justify-center gap-2'>
        <p className='text-gray-600'>No club selected</p>
      </div>
    );
  }
  
  return (
    <div className='bg-white'>
      <ClubDashboardHeaderMobile />
      <ClubDashboardBodyMobile clubId={selectedClubId} />
    </div>
  );
}

export default DashboardMobile;