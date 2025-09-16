'use client';

import React, { useState, useEffect } from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { StationType } from '@/lib/types/station';
import StationDetailsCard from '@/components/club-management/desktop/station/StationDetailsCard';
import { useSelector } from 'react-redux';
import { 
  selectSelectedClubStationState
} from '@/redux/slices/club/management/clubManagementSlice';
import { StationDetailsResponse } from '@/api/club/model';
import { Gamepad } from 'lucide-react';

function StationDetailsBody() {
  const {
    stations,
    stationsLoading,
    stationsError
  } = useSelector(selectSelectedClubStationState);

  const stationList = Object.values(stations);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const uniqueStationTypes: StationType[] = Array.from(
    new Set(
      stationList
        .map((station: StationDetailsResponse) => station.stationType)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      )
  );

  useEffect(() => {
    if (uniqueStationTypes.length && !selectedTab) {
      setSelectedTab(uniqueStationTypes[0]);
    }
  }, [uniqueStationTypes, selectedTab]);
  
  if (stationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-sm text-gray-500">Loading Stations...</p>
      </div>
    );
  }

  if (stationsError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">{stationsError}</p>
      </div>
    );
  }

  if(stationList.length <= 0){
    return (
        <div className='w-full h-full flex flex-col items-center justify-center gap-1 bg-white'>
            <Gamepad size={100} color='gray'/>
            <span className='text-xl text-gray-700'> 
                Add station to get started.
            </span>
            <span className='text-xs text-gray-600'> 
                Rate is required to add station
            </span>
        </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md h-full flex flex-col">
      {selectedTab && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <Tabs selected={selectedTab} onChange={setSelectedTab}>
              {uniqueStationTypes.map((type) => (
                <Tab key={type} label={type} value={type}>
                  <div className="h-[calc(100vh-16rem)] overflow-y-auto">
                    <div className="">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        { 
                          stationList
                            .filter((station: StationDetailsResponse) => station.stationType === type)
                            .sort((a, b) =>
                              a.stationName.toLowerCase().localeCompare(b.stationName.toLowerCase())
                            )
                            .map((station: StationDetailsResponse) => (
                              <StationDetailsCard 
                                key={station.stationId} 
                                stationDetails={station}
                              />
                            ))
                        }
                      </div>
                    </div>
                  </div>      
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

export default StationDetailsBody; 