'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { fetchClubIdsForAdminId } from '@/redux/slices/club/booking/clubBookingsListSlice';
import { useDispatchRedux } from '@/redux/store';
import UnAuthorized from '@/components/ui/UnAuthorized';
import CBMobileHeader from '@/components/club-bookings/mobile/CBMobileHeader';
import CBMobileBody from '@/components/club-bookings/mobile/CBMobileBody';

function ClubBookingsMobile() {
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
      <CBMobileHeader />
      <CBMobileBody />
    </div>
  );
}

export default ClubBookingsMobile;
