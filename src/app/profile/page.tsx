'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logoutAction } from '@/redux/slices/auth/authSlice';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="mb-4">
        <p><strong>User ID:</strong> {user.id ?? 'N/A'}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.role === 'PLAYER' && (
          <p><strong>Player ID:</strong> {user.playerId ?? 'N/A'}</p>
        )}
        {user.role === 'CLUB_ADMIN' && (
          <p><strong>Club Admin ID:</strong> {user.clubAdminId ?? 'N/A'}</p>
        )}
      </div>

      {user.role !== 'GUEST' && (
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
}
