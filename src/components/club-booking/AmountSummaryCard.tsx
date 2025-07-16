'use client';

import { BookingIntentCostDetails } from '@/api/booking/model';
import React from 'react';

interface AmountSummaryProps {
  amountDetails: BookingIntentCostDetails;
}

const AmountSummaryCard: React.FC<AmountSummaryProps> = ({amountDetails}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
      <h2 className="font-bold text-base mb-2 text-gray-700">Amount Summary</h2>
      <div className="space-y-1 text-sm text-gray-500">
        <div className="flex justify-start gap-2">
          <span className='font-medium'>Total Amount:</span>
          <span>₹{amountDetails.totalCost}</span>
        </div>
      </div>
    </div>
  );
};

export default AmountSummaryCard;
