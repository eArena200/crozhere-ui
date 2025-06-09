'use client';

import { Dialog } from '@headlessui/react';
import { X, Navigation, Upload, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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

function CreateOrEditClubForm({ isOpen, onClose, onSubmit, initialData: defaultValues }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('address.coordinates.latitude', pos.coords.latitude);
        setValue('address.coordinates.longitude', pos.coords.longitude);
      },
      (err) => {
        console.error('Location error:', err);
      }
    );
  };

  const handleFormSubmit = (data: ClubFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  }

  const isEdit = !!defaultValues?.clubName;
  const title = isEdit ? 'Edit Club' : 'Create New Club';
  const submitText = isEdit ? 'Update Club' : 'Create Club';

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-70">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <button onClick={handleCancel}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Cover image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="relative aspect-[3/1] w-full rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {coverPreview ? (
                    <img src={coverPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
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

              {/* Logo image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Logo
                </label>
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </label>
                </div>
              </div>

              {/* Club Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('clubName')}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                    placeholder="Enter club name"
                  />
                </div>
                {errors.clubName && <p className="text-sm text-red-600">{errors.clubName.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Location
                  </button>
                </div>

                <input
                  type="text"
                  {...register('address.street')}
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  placeholder="Street Address"
                />
                {errors.address?.street && <p className="text-sm text-red-600">{errors.address.street.message}</p>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      {...register('address.city')}
                      className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                      placeholder="City"
                    />
                    {errors.address?.city && <p className="text-sm text-red-600">{errors.address.city.message}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      {...register('address.state')}
                      className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                      placeholder="State"
                    />
                    {errors.address?.state && <p className="text-sm text-red-600">{errors.address.state.message}</p>}
                  </div>
                </div>

                <input
                  type="text"
                  {...register('address.pincode')}
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  placeholder="Pincode"
                />
                {errors.address?.pincode && <p className="text-sm text-red-600">{errors.address.pincode.message}</p>}
              </div>

              {/* Operating Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                  <input
                    type="time"
                    {...register('openTime')}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  />
                  {errors.openTime && <p className="text-sm text-red-600">{errors.openTime.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                  <input
                    type="time"
                    {...register('closeTime')}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  />
                  {errors.closeTime && <p className="text-sm text-red-600">{errors.closeTime.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
                <input
                  type="tel"
                  {...register('primaryContact')}
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  placeholder="Enter primary contact number"
                />
                {errors.primaryContact && <p className="text-sm text-red-600">{errors.primaryContact.message}</p>}
              </div>

              {/* Secondary Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact</label>
                <input
                  type="tel"
                  {...register('secondaryContact')}
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  placeholder="Enter secondary contact number (optional)"
                />
                {errors.secondaryContact && <p className="text-sm text-red-600">{errors.secondaryContact.message}</p>}
              </div>
              
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? `${isEdit ? 'Updating' : 'Creating'}...` : submitText}
                </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default CreateOrEditClubForm;