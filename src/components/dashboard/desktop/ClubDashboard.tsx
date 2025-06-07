import React, { useState } from 'react';
import ClubDashboardHeader from './ClubDashboardHeader';
import ClubDashboardSection from './ClubDashboardContent';
import { Station, StationType } from '@/lib/types/station';

const stationTypes: StationType[] = ['PC', 'PS4', 'XBOX', 'SNOOKER', 'POOL'];

const mockStations: Station[] = [
  { id: '1', name: 'A1', status: 'AVAILABLE', stationType: 'PC' },
  { id: '2', name: 'A2', status: 'OCCUPIED', stationType: 'PC' },
  { id: '3', name: 'A3', status: 'AVAILABLE', stationType: 'PC' },
  { id: '4', name: 'A4', status: 'OCCUPIED', stationType: 'PC' },
  { id: '5', name: 'A5', status: 'AVAILABLE', stationType: 'PC' },
  { id: '6', name: 'B1', status: 'OCCUPIED', stationType: 'PC' },
  { id: '7', name: 'B2', status: 'AVAILABLE', stationType: 'PC' },
  { id: '8', name: 'B3', status: 'OCCUPIED', stationType: 'PC' },
  { id: '9', name: 'B4', status: 'AVAILABLE', stationType: 'PC' },
  { id: '10', name: 'B5', status: 'OCCUPIED', stationType: 'PC' },
  { id: '11', name: 'PS1', status: 'AVAILABLE', stationType: 'PS4' },
  { id: '12', name: 'POOL1', status: 'AVAILABLE', stationType: 'POOL' },
  { id: '13', name: 'SNOOKER1', status: 'OCCUPIED', stationType: 'SNOOKER' },
  { id: '14', name: 'XBOX1', status: 'AVAILABLE', stationType: 'XBOX' },
  { id: '15', name: 'PS2', status: 'AVAILABLE', stationType: 'PS4' },
  { id: '16', name: 'PS3', status: 'AVAILABLE', stationType: 'PS4' },
  { id: '17', name: 'POOL2', status: 'UNAVAILABLE', stationType: 'POOL' },
];

export default function ClubDashboard() {
  const [activeStationType, setActiveStationType] = useState<StationType>('PC');

  return (
    <div className="border-2 border-gray-300 w-full h-full bg-white rounded flex flex-col">
      <ClubDashboardHeader 
        stationTypes={stationTypes} 
        activeStationType={activeStationType} 
        onChange={setActiveStationType} 
      />
      <ClubDashboardSection stationType={activeStationType} stations={mockStations}  />
    </div>
  );
}
