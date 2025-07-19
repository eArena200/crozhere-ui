'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


export const rateCardSchema = z.object({
    rateCardName: z.string().min(1, 'Rate-card name is required'),
});

export type RateCardFormData = z.infer<typeof rateCardSchema>;

interface RateCardFormProps {
    onSubmit: (data: RateCardFormData) => void;
    initialData?: Partial<RateCardFormData>;
}

const RateCardForm: React.FC<RateCardFormProps> = ({ 
    onSubmit,
    initialData 
}) => {
    
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<RateCardFormData>({
        resolver: zodResolver(rateCardSchema),
        defaultValues: {
            rateCardName: '',
            ...initialData
        }
    });

    const handleFormSubmit = (data: RateCardFormData) => {
        onSubmit(data);
        reset();
    }

    return (
        <form
            id="rate-card-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className='space-y-6'
        >
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Rate Card Name</label>
                <input
                type="text"
                {...register('rateCardName')}
                placeholder="Enter ratecard name"
                className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
                />
                {errors.rateCardName && (
                <p className="mt-1 text-sm text-red-600">{errors.rateCardName.message}</p>
                )}
            </div>

        </form>
    )
}


export default React.memo(RateCardForm);