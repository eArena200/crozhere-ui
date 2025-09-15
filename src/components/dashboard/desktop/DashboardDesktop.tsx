'use client';

import React, { useEffect } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  fetchClubsForAdminId, 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import ClubDashboardDesktopHeader from '@/components/dashboard/desktop/ClubDashboardDesktopHeader';
import ClubDashboardDesktopBody from '@/components/dashboard/desktop/ClubDashboardDesktopBody';
import UnAuthorized from '@/components/ui/UnAuthorized';

export default function AdminDesktop() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);

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

  return (
    <div className='bg-white px-2'>
      <ClubDashboardDesktopHeader/>
      <ClubDashboardDesktopBody />
    </div>
  );
}
