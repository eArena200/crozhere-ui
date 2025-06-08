'use client';

import React from 'react';
import { StationResponse } from '@/api/clubApi';

interface StationCardProps {
  station: StationResponse;
}

function StationCard({ station }: StationCardProps) {
  return (
    <div className="border p-2 rounded">
      <div><strong>Name:</strong> {station.stationName}</div>
      <div><strong>Type:</strong> {station.stationType}</div>
      <div><strong>Active:</strong> {station.isActive ? 'Yes' : 'No'}</div>
    </div>
  );
}

export default StationCard;
