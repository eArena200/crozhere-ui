'use client';

import { BookingIntentCostDetails } from '@/api/booking/model';
import React from 'react';

interface AmountSummaryProps {
  amountDetails: BookingIntentCostDetails;
}

const AmountSummaryCard: React.FC<AmountSummaryProps> = ({ amountDetails }) => {
  const { totalCost, costBreakup } = amountDetails;
  console.log("amountDetails:", JSON.stringify(amountDetails));

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
      <h2 className="font-bold text-base mb-4 text-gray-700">Amount Summary</h2>

      {/* Total */}
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="font-medium text-gray-800">Total Amount</span>
        <span className="text-gray-900 font-semibold">₹{totalCost}</span>
      </div>

      {/* Cost Breakups */}
      {costBreakup?.length ? (
        costBreakup.map((breakup, idx) => (
          <div key={idx} className="space-y-3 mb-4">
            <div className="flex justify-between text-sm border-b pb-1">
              <span className="font-medium text-gray-700">{breakup.category}</span>
              <span className="text-gray-800 font-medium">₹{breakup.cost}</span>
            </div>

            <div className="space-y-2 pl-2">
              {breakup.details?.map((item, j) => (
                <div
                  key={j}
                  className="flex justify-between items-start text-sm bg-white rounded p-2 border"
                >
                  <div>
                    <div className="font-medium text-gray-700">{item.subCategory}</div>
                    <div className="text-xs text-gray-500">
                      {item.qty} {item.qtyUnit} × ₹{item.rate} / {item.rateUnit}
                    </div>
                  </div>
                  <div className="text-gray-900 font-medium">₹{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-xs text-gray-400 italic">No cost breakdown available</div>
      )}
    </div>
  );
};

export default AmountSummaryCard;
