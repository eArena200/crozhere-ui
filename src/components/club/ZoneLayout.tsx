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
    { id: 'grp-1', name: 'PC Zone', stationType: 'PC', stationCount: 10, x: 750, y: 10, width: 440, height: 200 },
    { id: 'grp-2', name: 'POOL1', stationType: 'POOL', stationCount: 1, x: 150, y: 400, width: 150, height: 300 },
    { id: 'grp-1', name: 'SNOOKER', stationType: 'PC', stationCount: 6, x: 450, y: 300, width: 200, height: 400 },
    { id: 'grp-2', name: 'POOL2', stationType: 'POOL', stationCount: 1, x: 800, y: 400, width: 150, height: 300 },
  ],
  'First Floor': [],
};

function ZoneLayout({ zoneName }: ZoneLayoutProps) {
  const groups = mockStationGroups[zoneName] ?? [];

  return (
    <div className="w-full h-full overflow-auto rounded-md bg-green-100 p-2">
      <div className="relative w-[1200px] h-[800px] bg-green-300">
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
