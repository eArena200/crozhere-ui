'use client';

import React, { useEffect, useState } from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import { selectClubState } from '@/redux/slices/club/clubSlice';
import { AppDispatch } from '@/redux/store';
import { fetchStationsByClubId, selectStationState } from '@/redux/slices/club/stationSlice';
import { StationResponse } from '@/api/clubApi';
import { StationType } from '@/lib/types/station';
import StationCard from '@/components/club/StationCard';
import AddStation from '@/components/club/AddStation'; // Import AddStation dialog

function ClubDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs } = useSelector(selectClubState);
  const { stations } = useSelector(selectStationState);

  const selectedClub = clubs[0];
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  // Dialog open state
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);

  useEffect(() => {
    if (selectedClub) {
      dispatch(fetchStationsByClubId(selectedClub.clubId));
    }
  }, [dispatch, selectedClub]);

  // Get unique station types
  const uniqueStationTypes: StationType[] = Array.from(
    new Set(stations.map((station: StationResponse) => station.stationType))
  );

  // Set default tab after stations are loaded
  useEffect(() => {
    if (uniqueStationTypes.length && !selectedTab) {
      setSelectedTab(uniqueStationTypes[0]);
    }
  }, [uniqueStationTypes, selectedTab]);

  const handleSaveStation = (stationData: {
    stationName: string;
    stationType: StationType;
    isActive: boolean;
  }) => {
    // TODO: Implement station save logic here
    // e.g. dispatch(addStation({ clubId: selectedClub.clubId, ...stationData }))
    console.log('Saving new station:', stationData);
    // Optionally refresh stations after adding
    if (selectedClub) {
      dispatch(fetchStationsByClubId(selectedClub.clubId));
    }
  };

  if (!selectedClub) {
    return <div className="p-4 text-sm text-gray-600">Select a club to view details.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-full">
      <h2 className="text-xl font-bold mb-2">{selectedClub.name}</h2>

      {/* Club Info */}
      <div className="p-4 w-full border rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {selectedClub.name}</div>
          <div><strong>Location:</strong> N/A</div>
          <div><strong>Open Time:</strong> N/A</div>
          <div><strong>Close Time:</strong> N/A</div>
          <div><strong>Is Active:</strong> Yes</div>
          <div><strong>Is Verified:</strong> Yes</div>
        </div>
      </div>

      {/* Stations */}
      <div className="flex flex-col w-full p-4 border rounded">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Stations</h2>
          <button
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow"
            onClick={() => setIsAddStationOpen(true)}
          >
            + Add Station
          </button>
        </div>
        {selectedTab && (
          <Tabs selected={selectedTab} onChange={setSelectedTab}>
            {uniqueStationTypes.map((type) => (
              <Tab key={type} label={type} value={type}>
                <div className="overflow-y-auto h-[400px] pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stations
                      .filter((station: StationResponse) => station.stationType === type)
                      .map((station: StationResponse) => (
                        <StationCard key={station.stationId} station={station} />
                    ))}
                  </div>
                </div>      
              </Tab>
            ))}
          </Tabs>
        )}
      </div>

      {/* Add Station Dialog */}
      <AddStation
        isOpen={isAddStationOpen}
        onClose={() => setIsAddStationOpen(false)}
        onSave={handleSaveStation}
      />
    </div>
  );
}

export default ClubDetails;
