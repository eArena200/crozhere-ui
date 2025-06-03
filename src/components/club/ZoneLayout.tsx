import React from 'react';
import StationGroupLayout from './StationGroupLayout';

export interface ZoneLayoutProps {
  zoneName: string;
}

interface StationGroup {
  id: string;
  name: string;
  stationType: string;
  stationCount: number;
  x: number;       // in px
  y: number;       // in px
  width?: number;  // optional, in px
  height?: number; // optional, in px
}

const mockStationGroups: Record<string, StationGroup[]> = {
  'Ground Floor': [
    { id: 'grp-1', name: 'PC Zone', stationType: 'PC', stationCount: 6, x: 50, y: 50, width: 160, height: 96 },
    { id: 'grp-2', name: 'Pool Zone', stationType: 'POOL', stationCount: 2, x: 300, y: 60, width: 160, height: 96 },
  ],
  'First Floor': [],
};

function ZoneLayout({ zoneName }: ZoneLayoutProps) {
  const groups = mockStationGroups[zoneName] ?? [];

  return (
    <div className="w-full h-full overflow-auto rounded-md bg-green-100">
      <div className="relative w-[1000px] h-[600px] rounded">
        {groups.length > 0 ? (
          groups.map((group) => (
            <StationGroupLayout
              key={group.id}
              {...group}
              x={group.x}
              y={group.y}
              width={group.width}
              height={group.height}
              layoutType="GRID"
              stations={[]}
            />
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500">
            No station groups in this zone.
          </div>
        )}
      </div>
    </div>
  );
}

export default ZoneLayout;
