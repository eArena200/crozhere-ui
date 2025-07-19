'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ChargeType, ChargeTypeOptions, 
  ChargeUnit, ChargeUnitOptions 
} from '@/lib/types/rate';
import Button from '@/components/ui/Button';

const chargeSchema = z.object({
  chargeId: z.union([z.number(), z.undefined()]).optional(),
  chargeType: z.nativeEnum(ChargeType),
  chargeUnit: z.nativeEnum(ChargeUnit),
  amount: z.number().min(0, "Amount must be positive"),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  minPlayers: z.union([z.number().nonnegative(), z.nan()]).optional(),
  maxPlayers: z.union([z.number().nonnegative(), z.nan()]).optional(),
})
.refine(
    (data) => {
      const min = data.minPlayers;
      const max = data.maxPlayers;
      return !(min !== undefined && !Number.isNaN(min) && (max === undefined || Number.isNaN(max)));
    },
    {
      message: "Max Players is required when Min Players is defined",
      path: ["maxPlayers"],
    }
  )
  .refine(
    (data) => {
      const min = data.minPlayers;
      const max = data.maxPlayers;
      return !(min !== undefined && max !== undefined && !Number.isNaN(min) && !Number.isNaN(max) && min > max);
    },
    {
      message: "Min Players should be less than or equal to Max Players",
      path: ["minPlayers"],
    }
  );




export const rateSchema = z.object({
  rateName: z.string().min(1, 'Rate name is required'),
  charges: z.array(chargeSchema).min(1, "At least one charge is required"),
});

export type ChargeFormData = z.infer<typeof chargeSchema>;
export type RateFormData = z.infer<typeof rateSchema>;

interface RateFormProps {
  onSubmit: (data: RateFormData) => void;
  initialData?: Partial<RateFormData>;
}

const RateForm: React.FC<RateFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      rateName: '',
      charges: [
        {
          chargeType: ChargeType.BASE,
          chargeUnit: ChargeUnit.PER_HOUR,
          amount: 0,
        },
      ],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'charges',
  });

  const handleFormSubmit = (data: RateFormData) => {
    onSubmit(data);
  };

  return (
    <form
      id="rate-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Rate Name</label>
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

      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">Charges</div>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 border p-4 rounded-md relative bg-gray-50 border-gray-300">
            <div className="grid grid-cols-2 gap-3 text-gray-600">
              {/* Charge Type */}
              <div>
                <label className="block text-xs font-medium">Charge Type</label>
                <select
                  {...register(`charges.${index}.chargeType`)}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                >
                  {ChargeTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Charge Unit */}
              <div>
                <label className="block text-xs font-medium">Charge Unit</label>
                <select
                  {...register(`charges.${index}.chargeUnit`)}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                >
                  {ChargeUnitOptions.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium">Amount</label>
                <input
                  type="number"
                  step="1"
                  {...register(`charges.${index}.amount`, { valueAsNumber: true })}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                />
                {errors.charges?.[index]?.amount && (
                  <p className="text-xs text-red-600">{errors.charges[index]?.amount?.message}</p>
                )}
              </div>

              {/* Min Players */}
              <div>
                <label className="block text-xs font-medium">Min Players</label>
                <input
                  type="number"
                  {...register(`charges.${index}.minPlayers`, { valueAsNumber: true })}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                />
                {errors.charges?.[index]?.minPlayers && (
                  <p className="text-xs text-red-600">{errors.charges[index]?.minPlayers?.message}</p>
                )}
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-xs font-medium">Max Players</label>
                <input
                  type="number"
                  {...register(`charges.${index}.maxPlayers`, { valueAsNumber: true })}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                />
                {errors.charges?.[index]?.maxPlayers && (
                  <p className="text-xs text-red-600">{errors.charges[index]?.maxPlayers?.message}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-medium">Start Time</label>
                <input
                  type="time"
                  {...register(`charges.${index}.startTime`)}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-medium">End Time</label>
                <input
                  type="time"
                  {...register(`charges.${index}.endTime`)}
                  className="w-full px-2 py-1 border rounded-md text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          className='text-xs'
          onClick={() =>
            append({
              chargeType: ChargeType.BASE,
              chargeUnit: ChargeUnit.PER_HOUR,
              amount: 0,
            })
          }
        >
          + Charge
        </Button>
      </div>
    </form>
  );
};

export default React.memo(RateForm);
