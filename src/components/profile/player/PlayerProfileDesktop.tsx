import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, Swords } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDispatchRedux } from '@/redux/store';
import {
  selectPlayerState,
  selectPlayerIsLoading,
  selectPlayerError,
  loadPlayerById,
  updatePlayer,
} from '@/redux/slices/user/player/playerSlice';
import {
    logoutAction,
  selectAuthUser
} from '@/redux/slices/auth/authSlice';
import { UpdatePlayerRequest } from '@/api/user/player/model';

function PlayerProfileDesktop() {
  const dispatchRedux = useDispatchRedux();
  const user = useSelector(selectAuthUser);
  //TODO: Load the playerId from pathName itself
  const playerId = user?.roleBasedId;
  const player = useSelector(selectPlayerState);
  const isLoading = useSelector(selectPlayerIsLoading);
  const error = useSelector(selectPlayerError);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (typeof playerId === 'number' && player.playerId !== playerId) {
      dispatchRedux(loadPlayerById());
    }
  }, [dispatchRedux, playerId, player.playerId]);

  useEffect(() => {
    if (player.playerId) {
      setFormData({
        name: player.name || '',
        username: player.username || '',
        email: player.email || '',
        phone: player.phone || '',
      });
    }
  }, [player]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (player.playerId) {
      setFormData({
        name: player.name || '',
        username: player.username || '',
        email: player.email || '',
        phone: player.phone || '',
      });
    }
    setEditMode(false);
  };

  const handleSave = () => {
    if (playerId) {
      const updateRequest: UpdatePlayerRequest = {
        name: formData.name,
        username: formData.username,
        email: formData.email
      };
      dispatchRedux(updatePlayer(updateRequest));
    }
    setEditMode(false);
  };

  const handleChangePicture = () => {
    console.log('Change picture clicked');
  };

  const handleLogout = () => {
    dispatchRedux(logoutAction());
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">Loading player profile...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">Error loading player data.</div>
    );
  }

  return (
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-8 shadow-md items-center">
      <div className="flex flex-col justify-start mb-8">
        <Image
          src="/assets/player_avatar.png"
          alt="ProfilePicture"
          width={192}
          height={192}
          className="rounded-full"
          priority
        />
        <div className="p-2 flex flex-col justify-end">
          <Button variant="secondary" onClick={handleChangePicture} disabled={!editMode}>
            Update Photo
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        <Input
          label="Name"
          icon={<User />}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter name"
          disabled={!editMode}
        />

        <Input
          label="Username"
          icon={<Swords />}
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="Enter username"
          type="text"
          disabled={!editMode}
        />

        <Input
          label="Email"
          icon={<Mail />}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter email"
          type="email"
          disabled={!editMode}
        />

        <Input
          label="Phone"
          icon={<Phone />}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter phone number"
          type="tel"
          disabled={true}
        />

        <div className="flex flex-col items-end gap-4 mt-6">
          {!editMode && (
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}

          {editMode ? (
            <div className="flex flex-row gap-4">
              <Button 
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"  
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerProfileDesktop;
