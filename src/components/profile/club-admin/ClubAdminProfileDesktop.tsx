import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User, Mail, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

import { useDispatchRedux } from '@/redux/store';
import {
  selectClubAdminState,
  selectClubAdminIsLoading,
  selectClubAdminError,
  loadClubAdminById,
  updateClubAdmin,
} from '@/redux/slices/user/club-admin/clubAdminSlice';
import { logoutAction, selectAuthUser } from '@/redux/slices/auth/authSlice';
import { UpdateClubAdminRequest } from '@/api/user/club-admin/model';

function ClubAdminProfileDesktop() {
  const dispatchRedux = useDispatchRedux();
  const user = useSelector(selectAuthUser);
  const clubAdminId = user?.roleBasedId;

  const clubAdmin = useSelector(selectClubAdminState);
  const isLoading = useSelector(selectClubAdminIsLoading);
  const error = useSelector(selectClubAdminError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (typeof clubAdminId === 'number' && clubAdmin.clubAdminId !== clubAdminId) {
      dispatchRedux(loadClubAdminById());
    }
  }, [dispatchRedux, clubAdminId, clubAdmin.clubAdminId]);

  useEffect(() => {
    if (clubAdmin.clubAdminId) {
      setFormData({
        name: clubAdmin.name || '',
        email: clubAdmin.email || '',
        phone: clubAdmin.phone || '',
      });
    }
  }, [clubAdmin]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (clubAdmin.clubAdminId) {
      setFormData({
        name: clubAdmin.name || '',
        email: clubAdmin.email || '',
        phone: clubAdmin.phone || '',
      });
    }
    setEditMode(false);
  };

  const handleSave = () => {
    if (clubAdmin?.clubAdminId) {
      const updateRequest: UpdateClubAdminRequest = {
        name: formData.name,
        email: formData.email,
      };
      dispatchRedux(updateClubAdmin(updateRequest));
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
      <div className="bg-white h-screen w-full p-6 text-gray-600">
        Loading club admin profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white h-screen w-full p-6 text-red-600">
        Error loading club admin data.
        <Button
          variant="primary"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-8 shadow-md items-center">
      {/* Avatar and update photo */}
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
          <Button
            variant="secondary"
            onClick={handleChangePicture}
            disabled={!editMode}
          >
            Update Photo
          </Button>
        </div>
      </div>

      {/* Profile form */}
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
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
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

export default ClubAdminProfileDesktop;
