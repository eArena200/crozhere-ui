'use client';

import React from 'react';
import RateCardDetailsHeader from '@/components/club-management/desktop/rate/RateCardDetailsHeader';
import RateCardDetailsBody from '@/components/club-management/desktop/rate/RateCardDetailsBody';

function RateCardDetails() {
  return (
    <div className="bg-white border rounded shadow-md h-full flex flex-col">
      <RateCardDetailsHeader />
      <RateCardDetailsBody />
    </div>
  );
}

export default RateCardDetails;
