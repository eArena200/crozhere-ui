'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Navigation, Upload, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const phoneRegex = /^[6-9]\d{9}$/;

export const clubSchema = z.object({
  clubName: z.string().min(1, 'Club name is required'),
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
  primaryContact: z.string()
    .regex(phoneRegex, 'Primary contact must be a valid 10-digit Indian phone number'),
  secondaryContact: z.string()
    .regex(phoneRegex, 'Secondary contact must be a valid 10-digit Indian phone number')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  const openTime = new Date(`2000-01-01T${data.openTime}`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}`);
  return closeTime > openTime;
}, {
  message: "Close time must be after open time",
  path: ["closeTime"]
});

export type ClubFormData = z.infer<typeof clubSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClubFormData) => void;
  initialData?: Partial<ClubFormData>;
}

const CreateOrEditClubForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: '',
      logo: '',
      coverImage: '',
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
      primaryContact: '',
      secondaryContact: '',
    },
  });

  // Reset form with initialData on open or when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        clubName: initialData.clubName || '',
        logo: initialData.logo || '',
        coverImage: initialData.coverImage || '',
        address: {
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          pincode: initialData.address?.pincode || '',
          coordinates: {
            latitude: initialData.address?.coordinates?.latitude,
            longitude: initialData.address?.coordinates?.longitude,
          },
        },
        openTime: initialData.openTime || '09:00',
        closeTime: initialData.closeTime || '21:00',
        primaryContact: initialData.primaryContact || '',
        secondaryContact: initialData.secondaryContact || '',
      });

      setLogoPreview(initialData.logo || null);
      setCoverPreview(initialData.coverImage || null);
    } else {
      reset(); // Reset to defaults if no initial data
      setLogoPreview(null);
      setCoverPreview(null);
    }
  }, [initialData, reset, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      if (type === 'logo') {
        setLogoPreview(base64data);
        setValue('logo', base64data, { shouldValidate: true });
      } else {
        setCoverPreview(base64data);
        setValue('coverImage', base64data, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('address.coordinates.latitude', pos.coords.latitude, { shouldValidate: true });
        setValue('address.coordinates.longitude', pos.coords.longitude, { shouldValidate: true });
      },
      (err) => {
        console.error('Location error:', err);
      }
    );
  };

  const handleCancel = () => {
  reset();
  setLogoPreview(null);
  setCoverPreview(null);
  onClose();
};

  const onSubmitForm = (data: ClubFormData) => {
    onSubmit(data);
    onClose();
  };

  const isEdit = !!initialData?.clubName;
  const title = isEdit ? 'Edit Club' : 'Create New Club';
  const submitLabel = isEdit ? 'Update Club' : 'Create Club';

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            <button onClick={handleCancel} aria-label="Close form" className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col flex-1 p-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Cover Image</label>
              <div className="relative aspect-[3/1] rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  className="hidden"
                />
                <label
                  htmlFor="cover-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>

            {/* Logo Image */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Club Logo</label>
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-50">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>

            {/* Club Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Club Name</label>
              <input
                type="text"
                placeholder="Enter club name"
                {...register('clubName')}
                className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
              />
              {errors.clubName && <p className="mt-1 text-sm text-red-600">{errors.clubName.message}</p>}
            </div>

            {/* Address */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Get Location
                </button>
              </div>

              <input
                type="text"
                placeholder="Street Address"
                {...register('address.street')}
                className="w-full px-3 py-2 mb-1 border rounded-md text-gray-700 text-sm"
              />
              {errors.address?.street && <p className="text-sm text-red-600 mb-1">{errors.address.street.message}</p>}

              <div className="grid grid-cols-2 gap-4 mb-1">
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    {...register('address.city')}
                    className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
                  />
                  {errors.address?.city && <p className="text-sm text-red-600">{errors.address.city.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    {...register('address.state')}
                    className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
                  />
                  {errors.address?.state && <p className="text-sm text-red-600">{errors.address.state.message}</p>}
                </div>
              </div>

              <input
                type="text"
                placeholder="Pincode"
                {...register('address.pincode')}
                className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
              />
              {errors.address?.pincode && <p className="text-sm text-red-600">{errors.address.pincode.message}</p>}
            </div>

            {/* Open/Close Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Open Time</label>
                <input
                  type="time"
                  {...register('openTime')}
                  className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
                />
                {errors.openTime && <p className="text-sm text-red-600">{errors.openTime.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Close Time</label>
                <input
                  type="time"
                  {...register('closeTime')}
                  className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
                />
                {errors.closeTime && <p className="text-sm text-red-600">{errors.closeTime.message}</p>}
              </div>
            </div>

            {/* Primary Contact */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Primary Contact</label>
              <input
                type="tel"
                placeholder="Enter primary contact number"
                {...register('primaryContact')}
                className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
              />
              {errors.primaryContact && <p className="text-sm text-red-600">{errors.primaryContact.message}</p>}
            </div>

            {/* Secondary Contact */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Secondary Contact</label>
              <input
                type="tel"
                placeholder="Enter secondary contact number (optional)"
                {...register('secondaryContact')}
                className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
              />
              {errors.secondaryContact && <p className="text-sm text-red-600">{errors.secondaryContact.message}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="secondary" type="button" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : submitLabel}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateOrEditClubForm;
