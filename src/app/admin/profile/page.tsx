'use client';

import React from 'react';
import { useState } from 'react';
import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import ClubAdminProfileMobile from '@/components/profile/ClubAdminProfileMobile';
import ClubAdminProfileDesktop from '@/components/profile/ClubAdminProfileDesktop';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/redux/slices/auth/authSlice';
import LoginDialog from '@/components/ui/LoginDialog';

function AdminProfile() {
  const { type } = useDeviceType();
  const user = useSelector(selectAuthUser);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  if (user.role === 'CLUB_ADMIN') {
    return (type === DeviceTypes.MOBILE)
            ? <ClubAdminProfileMobile /> 
            : <ClubAdminProfileDesktop />;
  }

  return renderGuestProfile({
    onLoginClick: () => setIsLoginOpen(true),
    isLoginOpen,
    onClose: () => setIsLoginOpen(false),
  });
}

function renderGuestProfile({
  onLoginClick,
  isLoginOpen,
  onClose
}: {
  onLoginClick: () => void;
  isLoginOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className="bg-white flex flex-col w-full min-h-screen justify-center items-center p-4">
      <div className="text-black p-4">
        Login or Register to see your profile.
      </div>
      <Button 
        variant="primary"
        onClick={onLoginClick}
      >
        Login/Register
      </Button>
      {isLoginOpen && (
        <LoginDialog onClose={onClose} open={isLoginOpen} />
      )}
    </div>
  );
}

export default AdminProfile;