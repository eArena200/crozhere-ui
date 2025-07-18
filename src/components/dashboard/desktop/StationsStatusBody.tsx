import React from 'react';
import { Station, StationType } from '@/lib/types/station';
import StationStatusCard, { StationAvailableStatus } from './StationStatusCard';
import { StationDetailsResponse } from '@/api/clubManagementApi';
import { DashboardStationBookingStatus } from '@/api/booking/model';

type StationsStatusBodyProps = {
  stationType: StationType;
  stations: StationDetailsResponse[];
  stationBookings: Record<number, DashboardStationBookingStatus>
};


function StationsStatusBody({ stationType, stations, stationBookings }: StationsStatusBodyProps) {
  const filteredStations = stations.filter((s) => s.stationType === stationType);

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

        {filteredStations.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">
            No stations found for {stationType}
          </div>
        )}
      </div>
    </div>
  );
}

export default StationsStatusBody;
