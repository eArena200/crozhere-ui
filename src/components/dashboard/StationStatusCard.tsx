import React from 'react';
import { Station } from '@/lib/types/station';

type StationStatusCardProps = {
  station: Station;
};

export default function StationStatusCard({ station }: StationStatusCardProps) {
  const statusClasses = {
    AVAILABLE: 'bg-green-500',
    OCCUPIED: 'bg-red-600',
    UNAVAILABLE: 'bg-gray-500',
  };

  return (
    <div className="rounded h-32 shadow border-2 text-xs border-slate-400">
      <div className="flex h-full w-full justify-between">
        <div
          className={`w-1/4 h-full text-white font-semibold flex items-center justify-center ${statusClasses[station.status] || ''}`}
        >
          {station.name}
        </div>
        <div className="w-3/4 text-gray-600 flex items-center justify-end pr-2">
          {station.status.toLowerCase()}
        </div>
      </div>
    </div>
  );
}
