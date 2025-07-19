'use client';

import { PaymentMode } from '@/lib/types/payment';
import React from 'react';

interface PaymentModeSelectorProps {
  selectedMode: string;
  paymentModes: PaymentMode[];
  onChange: (mode: PaymentMode) => void;
}

const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  selectedMode,
  paymentModes,
  onChange,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      <h2 className="font-semibold text-base mb-2 text-gray-700">Select Payment Mode</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        {paymentModes.map((mode) => (
          <label key={mode} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMode"
              value={mode}
              checked={selectedMode === mode}
              onChange={() => onChange(mode)}
              className="accent-blue-600"
            />
            <span className="text-gray-800">{mode}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentModeSelector;
