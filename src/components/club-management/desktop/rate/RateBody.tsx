'use client';

import React from 'react';
import { 
    RateResponse,
    RateChargeResponse
} from '@/api/club/model';
import RateChargeListItem from '@/components/club-management/desktop/rate/RateChargeListItem';

interface RateBodyProps {
  rateDetails: RateResponse;
}

function RateBody({ rateDetails }: RateBodyProps) {
  const rateCharges = rateDetails.rateCharges;

  if(rateCharges.length === 0){
    return (
      <div className="text-gray-500 w-full h-full items-center justify-center flex">
        No charges available
      </div>
    )
  }

  return (
    <div className="space-y-2 mt-2">
      {rateCharges.map((charge: RateChargeResponse) => (
        <RateChargeListItem 
          key={charge.chargeId}
          rateCharge={charge}
        />
      ))}
    </div>
  );
}

export default RateBody;