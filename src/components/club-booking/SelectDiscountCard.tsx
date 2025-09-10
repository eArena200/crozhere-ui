'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface SelectDiscountCardProps {
  onApply: (amount: number, description: string) => void;
  loading?: boolean;
}

const SelectDiscountCard: React.FC<SelectDiscountCardProps> = ({ onApply, loading }) => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleApply = () => {
    if (!amount || !description.trim()) return;
    onApply(amount, description.trim());
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col gap-2">
      <h3 className="font-semibold text-base text-gray-800">Apply Discount</h3>

      <div className='flex flex-row gap-1 w-full items-end'>
        {/* Amount Input */}
        <div className="flex flex-col gap-1 w-1/5">
            <label className="text-xs font-medium text-gray-600">Amount</label>
            <input
            type="number"
            value={amount}
            min={0}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter amount"
            />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-1 w-3/5">
            <label className="text-xs font-medium text-gray-600">Description</label>
            <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter discount description"
            />
        </div>

        {/* Apply Button */}
        <div className="flex flex-col gap-1 w-1/5">
            <Button
            variant="secondary"
            onClick={handleApply}
            disabled={loading || !amount || !description.trim()}
            >
            {loading ? 'Applying...' : 'Apply'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectDiscountCard;
