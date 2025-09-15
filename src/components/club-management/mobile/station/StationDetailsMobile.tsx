'use client';

import React from 'react';
import StationDetailsHeaderMobile from '@/components/club-management/mobile/station/StationDetailsHeaderMobile';
import StationDetailsBodyMobile from '@/components/club-management/mobile/station/StationDetailsBodyMobile';

function StationDetails() {
  return (
    <div className="bg-white h-full flex flex-col">
      <StationDetailsHeaderMobile />
      <StationDetailsBodyMobile />
    </div>
  );
}

export default StationDetails; 