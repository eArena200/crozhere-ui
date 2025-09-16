'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSelectedClubRateState,
} from '@/redux/slices/club/management/clubManagementSlice';
import RateCardHeaderMobile from '@/components/club-management/mobile/rate/RateCardHeaderMobile';
import RateCardBodyMobile from '@/components/club-management/mobile/rate/RateCardBodyMobile';
import { SquareMenu } from 'lucide-react';

function RateCardDetailsBodyMobile() {
  const {
    rateCards
  } = useSelector(selectSelectedClubRateState);

  if(Object.values(rateCards).length === 0){
    return (
      <div className='w-full min-h-[60vh] flex flex-col items-center justify-center gap-1 bg-white'>
        <SquareMenu size={80} color='gray'/>
        <span className='text-lg text-gray-700'> 
          Add RateCard to get started.
        </span>
      </div>
    );
  }

  return (
    <div className='flex-1 border-2 border-blue-400 rounded-xl m-2 overflow-y-auto h-full'>
      <RateCardHeaderMobile />
      <RateCardBodyMobile />
    </div>
  );
}

export default RateCardDetailsBodyMobile;