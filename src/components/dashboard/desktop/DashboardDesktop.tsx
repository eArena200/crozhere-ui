import React, { useEffect } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  fetchClubsForAdminId, 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { useParams } from 'next/navigation';
import ClubDashboardDesktopHeader from './ClubDashboardDesktopHeader';
import ClubDashboardDesktopBody from './ClubDashboardDesktopBody';

export default function AdminDesktop() {
  const dispatchRedux = useDispatchRedux();
  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string);
  const authAdminId = useSelector(selectAuthRoleBasedId);

  useEffect(() => {
      if (authAdminId && paramAdminId === authAdminId) {
        dispatchRedux(fetchClubsForAdminId());
      }
    }, [dispatchRedux, paramAdminId, authAdminId]);

  if (!authAdminId || paramAdminId !== authAdminId) {
    return (
      <div>Unauthorized</div>
    );
  }

  return (
    <div className='bg-white px-2'>
      <ClubDashboardDesktopHeader onClickCreateNewBooking={() => {}}/>
      <ClubDashboardDesktopBody />
    </div>
  );
}
