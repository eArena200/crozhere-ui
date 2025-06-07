import React from 'react';
import { Station, StationType } from '@/lib/types/station';
import StationStatusCard from './StationStatusCard';

type ClubDashboardSectionProps = {
  stationType: StationType;
  stations: Station[];
};


function ClubDashboardSection({ stationType, stations }: ClubDashboardSectionProps) {
  const filteredStations = stations.filter((s) => s.stationType === stationType);

  return (
    <div className="flex-1 bg-gray-50 shadow-inner overflow-auto text-gray-800 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStations.map((station) => (
          <StationStatusCard key={station.id} station={station} />
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

export default ClubDashboardSection;
