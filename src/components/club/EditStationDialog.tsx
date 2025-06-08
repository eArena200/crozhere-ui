'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Monitor, Gamepad2, Power, IndianRupee, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { StationType } from '@/lib/types/station';
import { StationResponse } from '@/api/clubApi';

const editStationSchema = z.object({
  stationName: z.string().min(1, 'Station name is required'),
  stationType: z.enum(['SNOOKER', 'POOL', 'PC', 'PS4', 'XBOX'] as const),
  isActive: z.boolean(),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
  pricePerHour: z.number()
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price seems too high')
    .transform((val) => Number(val)),
}).refine((data) => {
  const openTime = new Date(`2000-01-01T${data.openTime}`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}`);
  return closeTime > openTime;
}, {
  message: "Close time must be after open time",
  path: ["closeTime"]
});

type EditStationFormData = z.infer<typeof editStationSchema>;

interface EditStationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stationData: EditStationFormData) => void;
  station: StationResponse;
}

function EditStationDialog({ isOpen, onClose, onSave, station }: EditStationDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditStationFormData>({
    resolver: zodResolver(editStationSchema),
    defaultValues: {
      stationName: station.stationName,
      stationType: station.stationType,
      isActive: station.isActive,
      openTime: '09:00', // These should come from the station data
      closeTime: '21:00', // These should come from the station data
      pricePerHour: 0, // This should come from the station data
    },
  });

  const stationType = watch('stationType');

  const onSubmit = (data: EditStationFormData) => {
    onSave(data);
    onClose();
  };

  const getStationTypeIcon = (type: StationType) => {
    switch (type) {
      case 'PC':
        return <Monitor className="h-5 w-5" />;
      case 'PS4':
      case 'XBOX':
        return <Gamepad2 className="h-5 w-5" />;
      default:
        return <Power className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-white shadow-xl">
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Edit Station
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">
                Station Name
              </label>
              <input
                type="text"
                id="stationName"
                {...register('stationName')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Enter station name"
              />
              {errors.stationName && (
                <p className="mt-1 text-sm text-red-600">{errors.stationName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="stationType" className="block text-sm font-medium text-gray-700 mb-1">
                Station Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getStationTypeIcon(stationType)}
                </div>
                <select
                  id="stationType"
                  {...register('stationType')}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PC">PC</option>
                  <option value="PS4">PS4</option>
                  <option value="XBOX">XBOX</option>
                  <option value="SNOOKER">Snooker</option>
                  <option value="POOL">Pool</option>
                </select>
              </div>
              {errors.stationType && (
                <p className="mt-1 text-sm text-red-600">{errors.stationType.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Operating Hours
              </label>
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

            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="pricePerHour"
                  step="0.01"
                  min="0"
                  {...register('pricePerHour', { valueAsNumber: true })}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter price per hour"
                />
              </div>
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-600">{errors.pricePerHour.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
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

export default EditStationDialog; 