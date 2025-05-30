'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logoutAction } from '@/redux/slices/auth/authSlice';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatchRedux = useDispatch();

  const handleLogout = () => {
    dispatchRedux(logoutAction());
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-start pt-10">
      <div className="p-4 max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
            <Image
              src="/assets/player_avatar.png"
              alt="User Avatar"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">@userHandle</p>
            <p className="text-sm text-gray-600">{'Name'}</p>
          </div>
        </div>

        <div className="text-left space-y-2 text-sm text-gray-800">
          <p><strong>📞 Phone:</strong> 9876543210</p>
          <p><strong>✉️ Email:</strong> user@email.com</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="danger"
          className="w-full mt-4"
        >
          Logout
        </Button>
      </div>
    </div>
  );

}
