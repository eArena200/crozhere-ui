'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StationType, StationTypeOptions } from '@/lib/types/station';

export const stationSchema = z.object({
    stationName: z.string().min(1, 'Station name is required'),
    stationType: z.nativeEnum(StationType),
    openTime: z.string().min(1, 'Open time is required'),
    closeTime: z.string().min(1, 'Close time is required'),
    capacity: z
      .number()
      .min(1, 'Station capacity cannot be zero')
      .max(10, 'Capacity cannot exceed 10'),
  })
  .refine(
    (data) => {
      const open = new Date(`2000-01-01T${data.openTime}`);
      const close = new Date(`2000-01-01T${data.closeTime}`);
      return close > open;
    },
    {
      message: 'Close time must be after open time',
      path: ['closeTime'],
    }
  );

export type StationFormData = z.infer<typeof stationSchema>;

interface StationFormProps {
  isEditMode?: boolean;
  onSubmit: (data: StationFormData) => void;
  onCancel: () => void;
  initialData?: Partial<StationFormData>;
}

const StationForm: React.FC<StationFormProps> = ({isEditMode=false, onSubmit, onCancel, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StationFormData>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      stationName: '',
      stationType: StationType.PC,
      openTime: '00:00',
      closeTime: '23:00',
      capacity: 1,
      ...initialData,
    },
  });

  const handleFormSubmit = (data: StationFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      id="station-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Station Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Station Name</label>
        <input
          type="text"
          {...register('stationName')}
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
          placeholder="Enter station name"
        />
        {errors.stationName && (
          <p className="mt-1 text-sm text-red-600">{errors.stationName.message}</p>
        )}
      </div>

      {/* Station Type */}
      { !isEditMode ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Station Type</label>
          <select 
            {...register('stationType')} 
            className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm">
              {StationTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
          {errors.stationType && (
            <p className="mt-1 text-sm text-red-600">{errors.stationType.message}</p>
          )}
        </div>
        ) : (<></>)
      }

      {/* Operating Hours */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
            <input 
              type="time" 
              {...register('openTime')} 
              className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm" 
            />
            {errors.openTime && (
              <p className="mt-1 text-sm text-red-600">{errors.openTime.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
            <input 
              type="time" 
              {...register('closeTime')} 
              className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
              />
            {errors.closeTime && (
              <p className="mt-1 text-sm text-red-600">{errors.closeTime.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Station Capacity</label>
        <div className="flex flex-row">
          <input
            type="number"
            min={1}
            max={10}
            {...register('capacity', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
            placeholder="Enter station capacity"
          />
        </div>
        {errors.capacity && (
          <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
        )}
      </div>
    </form>
  );
};

export default StationForm;
