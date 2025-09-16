'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChargeType,
  ChargeTypeOptions,
  ChargeUnit,
  ChargeUnitOptions,
} from '@/lib/types/rate';
import Button from '@/components/ui/Button';

const rateChargeSchema = z
  .object({
    chargeId: z.union([z.number(), z.undefined()]).optional(),

    chargeType: z.nativeEnum(ChargeType, {
      errorMap: () => ({ message: 'Charge type is required' }),
    }),
    chargeName: z.string().min(1, 'Charge name is required'),

    chargeAmount: z
      .number({ invalid_type_error: 'Amount is required' })
      .min(0, 'Amount must be positive'),
    chargeUnit: z.nativeEnum(ChargeUnit, {
      errorMap: () => ({ message: 'Charge unit is required' }),
    }),

    startTime: z.string().optional(),
    endTime: z.string().optional(),

    minPlayers: z.number().nonnegative().optional(),
    maxPlayers: z.number().nonnegative().optional(),
  })
  .refine(
    (data) => {
      if (data.minPlayers !== undefined && data.maxPlayers === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Max Players is required when Min Players is defined',
      path: ['maxPlayers'],
    }
  )
  .refine(
    (data) => {
      if (
        data.minPlayers !== undefined &&
        data.maxPlayers !== undefined &&
        data.minPlayers > data.maxPlayers
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Min Players should be less than or equal to Max Players',
      path: ['minPlayers'],
    }
  );

export type RateChargeFormData = z.infer<typeof rateChargeSchema>;

interface RateChargeFormProps {
  onSubmit: (data: RateChargeFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<RateChargeFormData>;
  isEditMode?: boolean;
}

const RateChargeForm: React.FC<RateChargeFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RateChargeFormData>({
    resolver: zodResolver(rateChargeSchema),
    defaultValues: {
      chargeType: initialData?.chargeType ?? ChargeTypeOptions[0],
      chargeUnit: initialData?.chargeUnit ?? ChargeUnitOptions[0],
      chargeAmount: initialData?.chargeAmount ?? 0,
      chargeName: initialData?.chargeName ?? '',
      startTime: initialData?.startTime,
      endTime: initialData?.endTime,
      minPlayers: initialData?.minPlayers,
      maxPlayers: initialData?.maxPlayers,
    },
  });

  const handleFormSubmit = (data: RateChargeFormData) => {
    onSubmit(data);
    if (!isEditMode) reset();
  };

  return (
    <form
      id="rate-charge-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Charge Type */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Charge Type
        </label>
        <select
          {...register('chargeType')}
          className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
        >
          {ChargeTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.chargeType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.chargeType.message}
          </p>
        )}
      </div>

      {/* Charge Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Charge Name
        </label>
        <input
          type="text"
          {...register('chargeName')}
          placeholder="Enter charge name"
          className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
        />
        {errors.chargeName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.chargeName.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          step="1"
          {...register('chargeAmount', { valueAsNumber: true })}
          className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
        />
        {errors.chargeAmount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.chargeAmount.message}
          </p>
        )}
      </div>

      {/* Charge Unit */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Charge Unit
        </label>
        <select
          {...register('chargeUnit')}
          className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
        >
          {ChargeUnitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.chargeUnit && (
          <p className="mt-1 text-sm text-red-600">
            {errors.chargeUnit.message}
          </p>
        )}
      </div>

      {/* Min / Max Players */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Min Players
          </label>
          <input
            type="number"
            {...register('minPlayers', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
          />
          {errors.minPlayers && (
            <p className="mt-1 text-sm text-red-600">
              {errors.minPlayers.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Max Players
          </label>
          <input
            type="number"
            {...register('maxPlayers', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
          />
          {errors.maxPlayers && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxPlayers.message}
            </p>
          )}
        </div>
      </div>

      {/* Start / End Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            {...register('startTime')}
            className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            {...register('endTime')}
            className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
          />
        </div>
      </div>
    </form>
  );
};

export default React.memo(RateChargeForm);
