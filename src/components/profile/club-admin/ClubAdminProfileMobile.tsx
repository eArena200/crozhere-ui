import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDispatchRedux } from '@/redux/store';
import { UpdateClubAdminRequest } from '@/api/clubAdminApi';
import {
  selectClubAdminState,
  selectClubAdminIsLoading,
  selectClubAdminError,
  loadClubAdminById,
  updateClubAdmin
} from '@/redux/slices/auth/clubAdminSlice';
import { logoutAction, selectAuthUser } from '@/redux/slices/auth/authSlice';

function ClubAdminProfileMobile() {
  const dispatchRedux = useDispatchRedux();
  const user = useSelector(selectAuthUser);
  //TODO: Load the clubAdminId from pathName itself
  const clubAdminId = user?.clubAdminId;

  const clubAdmin = useSelector(selectClubAdminState);
  const isLoading = useSelector(selectClubAdminIsLoading);
  const error = useSelector(selectClubAdminError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof clubAdminId === 'number' && clubAdmin.clubAdminId !== clubAdminId) {
      dispatchRedux(loadClubAdminById(clubAdminId));
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
    setFormData({
      name: clubAdmin.name || '',
      email: clubAdmin.email || '',
      phone: clubAdmin.phone || '',
    });
    setIsEditing(false);
  };

  const handleSave = () => {
      if (clubAdmin?.clubAdminId) {
        const updateRequest: UpdateClubAdminRequest = {
          name: formData.name,
          email: formData.email,
        };
        dispatchRedux(updateClubAdmin({
          clubAdminId: clubAdmin.clubAdminId,
          updateClubAdminRequest: updateRequest,
        }));
      }
      setIsEditing(false);
    };

  const handleChangePicture = () => {
    console.log("Change picture clicked");
  };

  const handleLogout = () => {
    dispatchRedux(logoutAction());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-center p-4">
        Error loading profile.
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen text-black p-4 space-y-6">
      <div className="flex justify-end items-center p-2">
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
            variant="link"
            aria-label="Edit"
          >
            <Pencil size={20} />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Image
          src="/assets/player_avatar.png"
          alt="ProfilePicture"
          width={128}
          height={128}
          className="rounded-full"
          priority
        />
        <Button
          variant="secondary"
          className="mt-3"
          onClick={handleChangePicture}
          disabled={!isEditing}
        >
          Update Photo
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          label="Name"
          icon={<User />}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter name"
          disabled={!isEditing}
        />

        <Input
          label="Email"
          icon={<Mail />}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email"
          type="email"
          disabled={!isEditing}
        />

        <Input
          label="Phone"
          icon={<Phone />}
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter phone number"
          type="tel"
          disabled={true}
        />

        {isEditing ? (
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        ) : (
          <div className="pt-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubAdminProfileMobile;
