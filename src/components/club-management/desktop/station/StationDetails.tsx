'use client';

import StationDetailsHeader from '@/components/club-management/desktop/station/StationDetailsHeader';
import StationDetailsBody from '@/components/club-management/desktop/station/StationDetailsBody';

function StationDetails() {  
  return (
    <div className="bg-white border rounded shadow-md h-full flex flex-col">
      <StationDetailsHeader />
      <StationDetailsBody />
    </div>
  );
}

export default StationDetails; 