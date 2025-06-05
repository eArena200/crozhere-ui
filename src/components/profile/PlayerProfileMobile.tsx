import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Pencil, Swords } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useDispatchRedux } from "@/redux/store";
import {
  selectPlayerState,
  selectPlayerIsLoading,
  selectPlayerError,
  loadPlayerById,
} from '@/redux/slices/auth/playerSlice';
import { selectAuthUser } from '@/redux/slices/auth/authSlice';

function PlayerProfileMobile() {
    const dispatchRedux = useDispatchRedux();
    const user = useSelector(selectAuthUser);
    const playerId = user?.playerId;
    const player = useSelector(selectPlayerState);
    const isLoading = useSelector(selectPlayerIsLoading);
    const error = useSelector(selectPlayerError);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
    });

  const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (typeof playerId === 'number' && player.playerId !== playerId) {
            dispatchRedux(loadPlayerById(playerId));
        }
    }, [dispatchRedux, player.playerId, playerId]);

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
    setIsEditing(false);
    };

    const handleSave = () => {
    console.log('Saved form data:', formData);
    setIsEditing(false);
    };

    const handleChangePicture = () => {
    console.log('Change picture clicked');
    };

    const handleLogout = () => {
    console.log('Logout clicked');
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
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter name"
            disabled={!isEditing}
        />

        <Input
            label="Username"
            icon={<Swords />}
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Enter username"
            type="text"
            disabled={!isEditing}
        />

        <Input
            label="Email"
            icon={<Mail />}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email"
            type="email"
            disabled={!isEditing}
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

export default PlayerProfileMobile;
