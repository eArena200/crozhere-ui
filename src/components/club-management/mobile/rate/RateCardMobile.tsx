'use client';

import React from 'react'
import RateHeaderMobile from '@/components/club-management/mobile/rate/RateHeaderMobile';
import RateBodyMobile from '@/components/club-management/mobile/rate/RateBodyMobile';
import { RateResponse } from '@/api/club/model';

interface RateCardMobileProps {
  rateDetails: RateResponse;
}

function RateCardMobile({ rateDetails }: RateCardMobileProps) {
  return (
    <div className='flex flex-col h-full w-full 
      border-2 border-blue-200 rounded-md bg-white
      shadow-blue-200 shadow-lg px-4 py-2 justify-start
      hover:shadow-blue-300 hover:shadow-xl transition '
    >
      <RateHeaderMobile rateDetails={rateDetails} />
      <RateBodyMobile rateDetails={rateDetails} />
    </div>
  )
}

export default RateCardMobile;