'use client';

import React from 'react';
import { StationType } from '@/lib/types/station';

type StationsStatusHeaderProps = {
  stationTypes: StationType[];
  activeStationType: StationType;
  onChange: (stationType: StationType) => void;
};

function StationsStatusHeader({
  stationTypes,
  activeStationType,
  onChange,
}: StationsStatusHeaderProps) {
  return (
    <div className="flex z-50 shadow justify-between text-sm font-semibold text-gray-600">
      {stationTypes.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex-1 text-center p-2 rounded-t-sm
            ${activeStationType === type
              ? 'bg-blue-600 text-white shadow font-bold'
              : 'hover:bg-blue-200 text-gray-700 bg-white'}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default StationsStatusHeader;
