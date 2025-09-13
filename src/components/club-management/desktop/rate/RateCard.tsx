import React from 'react'
import RateHeader from '@/components/club-management/desktop/rate/RateHeader';
import RateBody from '@/components/club-management/desktop/rate/RateBody';
import { RateResponse } from '@/api/club/model';

interface RateCardProps {
  rateDetails: RateResponse;
}

function RateCard({ rateDetails }: RateCardProps) {
  return (
    <div className='flex flex-col h-full w-full 
      border-2 border-blue-200 rounded-md bg-white
      shadow-blue-200 shadow-lg px-4 py-2 justify-start
      hover:shadow-blue-300 hover:shadow-xl transition '
    >
      <RateHeader rateDetails={rateDetails} />
      <RateBody rateDetails={rateDetails} />
    </div>
  )
}

export default RateCard;