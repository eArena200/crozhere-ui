'use client';

import React from 'react';
import { StationType } from '@/lib/types/station';
import { DashboardStationBookingStatus } from '@/api/booking/model';
import { StationDetailsResponse } from '@/api/club/model';
import StationStatusCardMobile from '@/components/dashboard/mobile/activity/StationStatusCardMobile';

type StationsStatusBodyProps = {
  stationType: StationType;
  stations: StationDetailsResponse[];
  stationBookings: Record<number, DashboardStationBookingStatus>
};


function StationsStatusBodyMobile({ stationType, stations, stationBookings }: StationsStatusBodyProps) {
  const filteredStations = stations.filter((s) => s.stationType === stationType);

  return (
    <div className="flex-1 pt-12 bg-white text-gray-800 
    grid grid-cols-1 overflow-y-auto gap-y-2 px-2">
        {filteredStations.map((station) => (
          <StationStatusCardMobile
            key={station.stationId}
            stationDetails={station}
            currentBooking={stationBookings[station.stationId]?.currentBooking} 
            nextBooking={stationBookings[station.stationId]?.nextBooking}  
          />
        ))}
      </div>
  );
}

export default StationsStatusBodyMobile;
