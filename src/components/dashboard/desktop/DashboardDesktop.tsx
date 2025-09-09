import React, { useEffect } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  fetchClubsForAdminId, 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import ClubDashboardDesktopHeader from './ClubDashboardDesktopHeader';
import ClubDashboardDesktopBody from './ClubDashboardDesktopBody';

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
      <div>Unauthorized</div>
    );
  }

  return (
    <div className='bg-white px-2'>
      <ClubDashboardDesktopHeader/>
      <ClubDashboardDesktopBody />
    </div>
  );
}
