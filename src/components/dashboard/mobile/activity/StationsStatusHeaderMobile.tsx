'use client';

import { StationType } from '@/lib/types/station';
import React from 'react';

type StationsStatusHeaderProps = {
  stationTypes: StationType[];
  activeStationType: StationType;
  onChange: (stationType: StationType) => void;
};

function StationsStatusHeaderMobile({
  stationTypes,
  activeStationType,
  onChange,
}: StationsStatusHeaderProps) {
  return (
    <div className='fixed top-28 h-11 z-20 w-full bg-white'>
      <div className="flex justify-between text-sm font-mono text-gray-600 gap-2 px-2 py-1">
        {stationTypes.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex-1 text-center p-2 rounded-sm
              ${activeStationType === type
                ? 'bg-blue-600 text-white shadow font-bold'
                : 'hover:bg-blue-200 text-gray-700 bg-white'}`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StationsStatusHeaderMobile;
