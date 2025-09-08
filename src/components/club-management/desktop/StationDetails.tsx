'use client';

import React, { useState, useEffect } from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { StationType } from '@/lib/types/station';
import StationDetailsCard from '@/components/club-management/desktop/StationDetailsCard';
import { Plus } from 'lucide-react';
import AddStationDialog from '@/components/club-management/AddStationDialog';
import { StationFormData } from '@/components/club-management/StationForm';
import { useSelector } from 'react-redux';
import { 
  addNewStation,
  selectClubManagementState,
  selectSelectedClubId,
  selectSelectedClubStationState
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { StationDetailsResponse } from '@/api/club/model';

function StationDetails() {
  const dispatchRedux = useDispatchRedux();

  const {
    stations,
    stationsLoading,
    stationsError,
    addStationLoading,
    addStationError
  } = useSelector(selectSelectedClubStationState);

  const authAdminId = useSelector(selectAuthRoleBasedId);
  const clubId = useSelector(selectSelectedClubId);

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);

  const uniqueStationTypes: StationType[] = Array.from(
    new Set(
      Object.values(stations)
        .map((station: StationDetailsResponse) => station.stationType)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      )
  );

  useEffect(() => {
    if (uniqueStationTypes.length && !selectedTab) {
      setSelectedTab(uniqueStationTypes[0]);
    }
  }, [uniqueStationTypes, selectedTab]);

  const handleAddStation = (stationData: StationFormData) => {
    if(authAdminId && clubId){
      dispatchRedux(
        addNewStation({
          clubId: clubId,
          stationFormData: stationData
        }))
        .unwrap()
        .then(() => {
          setIsAddStationOpen(false);
        })
        .catch((err) => {
          console.error('Add Station failed: ', err);
        })
    }
  };

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

  return (
    <div className="bg-white rounded shadow-md h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Stations</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your club's stations</p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors duration-200"
          onClick={() => setIsAddStationOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Station</span>
        </button>
      </div>

      {selectedTab && (
        <div className="flex-1 overflow-hidden">
          <div className="px-4 pt-4">
            <Tabs selected={selectedTab} onChange={setSelectedTab}>
              {uniqueStationTypes.map((type) => (
                <Tab key={type} label={type} value={type}>
                  <div className="h-[calc(100vh-16rem)] overflow-y-auto">
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        { 
                          Object.values(stations)
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

      <AddStationDialog 
        isOpen={isAddStationOpen} 
        onClose={() => setIsAddStationOpen(false)} 
        onSubmit={handleAddStation}  
        loading={addStationLoading}
        error={addStationError}      
      />
    </div>
  );
}

export default StationDetails; 