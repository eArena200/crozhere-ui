'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Clock, MapPin, Building2, Navigation, Image as ImageIcon, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClubResponse } from '@/api/clubApi';
import Button from '@/components/ui/Button';

const editClubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
}).refine((data) => {
  const openTime = new Date(`2000-01-01T${data.openTime}`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}`);
  return closeTime > openTime;
}, {
  message: "Close time must be after open time",
  path: ["closeTime"]
});

type EditClubFormData = z.infer<typeof editClubSchema>;

interface EditClubDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditClubFormData) => void;
  club: ClubResponse;
}

function EditClubDialog({ isOpen, onClose, onSave, club }: EditClubDialogProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EditClubFormData>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      name: club.name,
      logo: club.logo || '',
      coverImage: club.coverImage || '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: {
          latitude: undefined,
          longitude: undefined,
        },
      },
      openTime: '09:00',
      closeTime: '21:00',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          setLogoPreview(result);
          setValue('logo', result);
        } else {
          setCoverPreview(result);
          setValue('coverImage', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('address.coordinates.latitude', position.coords.latitude);
          setValue('address.coordinates.longitude', position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const onSubmit = async (data: EditClubFormData) => {
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save club:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Edit Club Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="relative">
                    <div className="aspect-[3/1] w-full rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'cover')}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Upload className="h-6 w-6 text-white" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Logo
                  </label>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                    >
                      <Upload className="h-6 w-6 text-white" />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter club name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Get Location
                    </button>
                  </div>

                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="street"
                        {...register('address.street')}
                        className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                        placeholder="Enter street address"
                      />
                    </div>
                    {errors.address?.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        {...register('address.city')}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                        placeholder="Enter city"
                      />
                      {errors.address?.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        {...register('address.state')}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                        placeholder="Enter state"
                      />
                      {errors.address?.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      {...register('address.pincode')}
                      className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter pincode"
                    />
                    {errors.address?.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="openTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Open Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="openTime"
                        {...register('openTime')}
                        className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.openTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.openTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Close Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="closeTime"
                        {...register('closeTime')}
                        className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.closeTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.closeTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default EditClubDialog; 