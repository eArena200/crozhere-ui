'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedClubRateState } from '@/redux/slices/club/clubManagementSlice';
import { Info } from 'lucide-react';
import RateCard from '@/components/club-management/desktop/rate/RateCard';

function RateCardBody() {
  const { rateCards, selectedRateCardId } = useSelector(selectSelectedClubRateState);

  if (!selectedRateCardId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-white">
        <Info size={100} color="gray" />
        <span className="text-xl text-gray-700">
          Select a RateCard to view its details.
        </span>
      </div>
    );
  }

  const selectedRateCard = rateCards[selectedRateCardId];

  return (
    <>
      {selectedRateCard && (
        <div className="flex flex-col flex-1 h-full px-2 min-h-0">
          <div
            className="flex-1 rounded-md p-3 pb-6 overflow-y-auto min-h-0"
          >
            {Object.values(selectedRateCard.rates).length === 0 ? (
              <p className="text-sm text-gray-500 p-4">No rates available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(selectedRateCard.rates).map((rateDetails) => (
                  <RateCard key={rateDetails.rateId} rateDetails={rateDetails} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default RateCardBody;
