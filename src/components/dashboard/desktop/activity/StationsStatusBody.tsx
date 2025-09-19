'use client';

import React from 'react';
import { StationType } from '@/lib/types/station';
import StationStatusCard from '@/components/dashboard/desktop/activity/StationStatusCard';
import { DashboardStationBookingStatus } from '@/api/booking/model';
import { StationDetailsResponse } from '@/api/club/model';

type StationsStatusBodyProps = {
  stationType: StationType;
  stations: StationDetailsResponse[];
  stationBookings: Record<number, DashboardStationBookingStatus>
};


function StationsStatusBody({ stationType, stations, stationBookings }: StationsStatusBodyProps) {
  const filteredStations = stations.filter((s) => s.stationType === stationType);

  if(filteredStations.length === 0){
    return (
      <div className="flex flex-col h-full w-full items-center justify-between text-gray-600">
        No stations found for the club.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 shadow-inner overflow-auto text-gray-800 p-2">
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStations.map((station) => (
          <StationStatusCard 
            key={station.stationId} 
            stationDetails={station}
            currentBooking={stationBookings[station.stationId]?.currentBooking} 
            nextBooking={stationBookings[station.stationId]?.nextBooking}  
          />
        ))}
      </div>
    </div>
  );
}

export default StationsStatusBody;
