'use client';

import React from 'react';
import { Navigation } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


const phoneRegex = /^[6-9]\d{9}$/;

export const clubSchema = z.object({
  clubName: z.string().min(1, 'Club name is required'),
  clubDescription: z.string().min(1, 'Club Description is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    area: z.string().min(1, 'Area is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
    coordinates: z.object({
      latitude: z.union([z.number(), z.null(), z.undefined()]).optional(),
      longitude: z.union([z.number(), z.null(), z.undefined()]).optional(),
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

interface ClubFormProps {
  isEditMode?: boolean;
  onSubmit: (data: ClubFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ClubFormData>;
}

const ClubForm: React.FC<ClubFormProps> = ({ isEditMode=false, onSubmit, onCancel, initialData }) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: '',
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
      ...initialData
    },
  });

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

  const handleFormSubmit = (data: ClubFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form 
      id="club-form"
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6"
    >
      {/* Club Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Club Name</label>
        <input
          type="text"
          {...register('clubName')}
          placeholder="Enter club name"
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
        />
        {errors.clubName && (
          <p className="mt-1 text-sm text-red-600">{errors.clubName.message}</p>
        )}
      </div>

      {/* Club Description */} 
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Club Description</label>
        <input
          type="text"
          {...register('clubDescription')}
          placeholder="Enter club description"
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
        />
        {errors.clubDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.clubDescription.message}</p>
        )}
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
              placeholder="Area"
              {...register('address.area')}
              className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
            />
            {errors.address?.area && <p className="text-sm text-red-600">{errors.address.area.message}</p>}
          </div>
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
    </form>
  );
};

export default React.memo(ClubForm);
