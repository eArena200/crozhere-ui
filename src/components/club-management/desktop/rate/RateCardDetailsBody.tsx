'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSelectedClubRateState,
} from '@/redux/slices/club/clubManagementSlice';
import RateCardHeader from '@/components/club-management/desktop/rate/RateCardHeader';
import RateCardBody from '@/components/club-management/desktop/rate/RateCardBody';
import { SquareMenu } from 'lucide-react';

function RateCardDetailsBody() {
  const {
    rateCards
  } = useSelector(selectSelectedClubRateState);

  if(Object.values(rateCards).length === 0){
    return (
      <div className='w-full h-full flex flex-col items-center justify-center gap-1 bg-white'>
        <SquareMenu size={100} color='gray'/>
        <span className='text-xl text-gray-700'> 
          Add RateCard to get started.
        </span>
      </div>
    );
  }

  return (
    <div className='flex-1 border-2 border-blue-400 rounded-xl m-2 overflow-y-auto h-full'>
      <RateCardHeader />
      <RateCardBody />
    </div>
  );
}

export default RateCardDetailsBody;