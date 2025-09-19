'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { fetchClubIdsForAdminId } from '@/redux/slices/club/booking/clubBookingsListSlice';
import { useDispatchRedux } from '@/redux/store';
import UnAuthorized from '@/components/ui/UnAuthorized';
import CBDesktopHeader from '@/components/club-bookings/desktop/CBDesktopHeader';
import CBDesktopBody from '@/components/club-bookings/desktop/CBDesktopBody';

function ClubBookingsDesktop() {
  const dispatch = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);

  useEffect(() => {
    if (authAdminId) {
      dispatch(fetchClubIdsForAdminId());
    }
  }, [dispatch, authAdminId]);

  if (!authAdminId) {
    return <UnAuthorized />;
  }

  return (
    <div className="flex flex-col w-full min-h-[90vh] bg-white">
      <CBDesktopHeader />
      <CBDesktopBody />
    </div>
  );
}

export default ClubBookingsDesktop;
