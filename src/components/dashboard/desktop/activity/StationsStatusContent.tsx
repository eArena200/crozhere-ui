'use client';

import React, { useEffect, useState } from 'react';
import StationsStatusHeader from '@/components/dashboard/desktop/activity/StationsStatusHeader';
import StationsStatusBody from '@/components/dashboard/desktop/activity/StationsStatusBody';
import { useSelector } from 'react-redux';
import { 
  selectClubSupportedStations,
  selectStationBookingStatusMap
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { StationType } from '@/lib/types/station';

function StationsStatusContent() {
  const clubSupportedStations = useSelector(selectClubSupportedStations);
  const stationsBookingState = useSelector(selectStationBookingStatusMap);
  
  const stations = Object.values(clubSupportedStations);
  const stationTypes: StationType[] = [...new Set(stations.map(stn => stn.stationType))];
  const [activeStationType, setActiveStationType] = useState<StationType>(stationTypes[0]);

  useEffect(() => {
    if (!activeStationType && stationTypes.length > 0) {
      setActiveStationType(stationTypes[0]);
    }
  }, [stationTypes]);


  return (
    <div className="border-2 border-gray-300 w-full h-full min-h-screen bg-white rounded flex flex-col">
      <StationsStatusHeader 
        stationTypes={stationTypes} 
        activeStationType={activeStationType} 
        onChange={setActiveStationType} 
      />
      <StationsStatusBody 
        stationType={activeStationType} 
        stations={stations} 
        stationBookings={stationsBookingState}  
      />
    </div>
  );
}

export default StationsStatusContent;
