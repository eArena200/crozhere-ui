'use client';

import React from 'react';
import RateCardDetailsHeaderMobile from '@/components/club-management/mobile/rate/RateCardDetailsHeaderMobile';
import RateCardDetailsBodyMobile from '@/components/club-management/mobile/rate/RateCardDetailsBodyMobile';

function RateCardDetailsMobile() {
  return (
    <div className="bg-white rounded shadow-md h-full flex flex-col">
      <RateCardDetailsHeaderMobile />
      <RateCardDetailsBodyMobile />
    </div>
  );
}

export default RateCardDetailsMobile;
