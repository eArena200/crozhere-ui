'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';

export const rateSchema = z.object({
  rateName: z.string().min(1, 'Rate name is required').max(100, 'Rate name too long'),
  rateDescription: z.string().min(1, 'Rate description is required').max(500, 'Rate description too long'),
});

export type RateFormData = z.infer<typeof rateSchema>;

interface RateFormProps {
  onSubmit: (data: RateFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<RateFormData>;
  isEditMode?: boolean;
}

const RateForm: React.FC<RateFormProps> = ({ onSubmit, onCancel, initialData, isEditMode = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      rateName: '',
      rateDescription: '',
      ...initialData,
    },
  });

  const handleFormSubmit = (data: RateFormData) => {
    onSubmit(data);
    if (!isEditMode) reset();
  };

  return (
    <form 
      id="rate-form" 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6"
    >
      {/* Rate Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Rate Name
        </label>
        <input
          type="text"
          {...register('rateName')}
          placeholder="Enter rate name"
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
        />
        {errors.rateName && (
          <p className="mt-1 text-sm text-red-600">{errors.rateName.message}</p>
        )}
      </div>

      {/* Rate Description */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Rate Description
        </label>
        <textarea
          {...register('rateDescription')}
          placeholder="Enter rate description"
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
        />
        {errors.rateDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.rateDescription.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button type="submit">
          {isEditMode ? 'Update Rate' : 'Save Rate'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default React.memo(RateForm);
