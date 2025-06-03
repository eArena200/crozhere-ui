import React from 'react';

export type LayoutType = 'GRID' | 'U' | 'V' | 'SEMICIRCLE';

interface Station {
  id: string;
  label: string;
}

interface StationGroupLayoutProps {
  id: string;
  name: string;
  stationType: string;
  stationCount: number;
  layoutType: LayoutType;
  stations: Station[];
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export default function StationGroupLayout({
  name,
  stationType,
  stationCount,
  layoutType,
  stations,
  x,
  y,
  width = 160,
  height = 96,
}: StationGroupLayoutProps) {
  return (
    <div
      className="absolute bg-white border rounded shadow p-[0.5rem] text-[0.75rem]"
      style={{
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <h4 className="font-bold text-gray-800 mb-[0.25rem] text-[0.85rem]">{name}</h4>
      <p className="text-gray-600">Type: {stationType}</p>
      <p className="text-gray-600">Stations: {stationCount}</p>
    </div>
  );
}
