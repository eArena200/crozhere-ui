'use client';

import React from 'react';
import { 
    RateResponse,
    RateChargeResponse
} from '@/api/club/model';
import RateChargeListItemMobile from '@/components/club-management/mobile/rate/RateChargeListItemMobile';

interface RateBodyMobileProps {
  rateDetails: RateResponse;
}

function RateBodyMobile({ rateDetails }: RateBodyMobileProps) {
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
        <RateChargeListItemMobile
          key={charge.chargeId}
          rateCharge={charge}
        />
      ))}
    </div>
  );
}

export default RateBodyMobile;