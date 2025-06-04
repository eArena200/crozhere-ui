import { StationType } from '@/lib/types/station';
import React from 'react';

type ClubDashboardHeaderProps = {
  stationTypes: StationType[];
  activeStationType: StationType;
  onChange: (stationType: StationType) => void;
};

function ClubDashboardHeader({
  stationTypes,
  activeStationType,
  onChange,
}: ClubDashboardHeaderProps) {
  return (
    <div className="flex z-50 shadow justify-between text-sm font-semibold text-gray-600">
      {stationTypes.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex-1 text-center p-2 rounded-t-sm
            ${activeStationType === type
              ? 'bg-blue-500 text-white shadow font-bold'
              : 'hover:bg-blue-100 text-gray-700 bg-white'}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default ClubDashboardHeader;
