'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectClubSupportedStations, 
  selectStationBookingStatusMap 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';
import { StationType } from '@/lib/types/station';
import StationsStatusHeaderMobile from './StationsStatusHeaderMobile';
import StationsStatusBodyMobile from './StationsStatusBodyMobile';
import { Gamepad } from 'lucide-react';

function StationsStatusContentMobile() {
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

  if(stations.length == 0){
    return (
      <div className="w-full min-h-[70vh] bg-white flex flex-col gap-2 items-center justify-center">
        <Gamepad size={100} className="text-gray-400" />
        <p className="text-gray-500 text-lg">No stations available</p>
      </div>
    );
  }


  return (
    <div className="w-full h-full bg-white rounded flex flex-col">
      <StationsStatusHeaderMobile 
        stationTypes={stationTypes} 
        activeStationType={activeStationType} 
        onChange={setActiveStationType} 
      />
      <StationsStatusBodyMobile
        stationType={activeStationType} 
        stations={stations} 
        stationBookings={stationsBookingState}  
      />
    </div>
  );
}

export default StationsStatusContentMobile;
