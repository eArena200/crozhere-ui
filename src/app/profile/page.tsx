'use client';

import { useState } from 'react';
import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import ClubAdminProfileMobile from '@/components/profile/ClubAdminProfileMobile';
import ClubAdminProfileDesktop from '@/components/profile/ClubAdminProfileDesktop';
import PlayerProfileMobile from '@/components/profile/PlayerProfileMobile';
import PlayerProfileDesktop from '@/components/profile/PlayerProfileDesktop';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/redux/slices/auth/authSlice';
import LoginDialog from '@/components/ui/LoginDialog';

export default function ProfilePage() {
  const { type } = useDeviceType();
  const user = useSelector(selectAuthUser);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (user.role === 'CLUB_ADMIN') {
    return type === DeviceTypes.MOBILE ? <ClubAdminProfileMobile /> : <ClubAdminProfileDesktop />;
  }

  if (user.role === 'PLAYER') {
    return type === DeviceTypes.DESKTOP ? <PlayerProfileMobile /> : <PlayerProfileDesktop />;
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
        Seems like you don't have an account.
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
