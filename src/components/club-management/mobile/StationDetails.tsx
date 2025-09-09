'use client';

import React, { useEffect, useState } from 'react';
import StationListItem from '@/components/club-management/mobile/StationListItem';
import { StationType } from '@/lib/types/station';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  addNewStation,
  deleteStation,
  selectClubManagementState,
  selectSelectedClubId,
  selectSelectedClubStationState,
  toggleStation, 
  updateStationDetails
} from '@/redux/slices/club/clubManagementSlice';
import { StationFormData } from '@/components/club-management/StationForm';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { Plus } from 'lucide-react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import AddStationDialog from '@/components/club-management/AddStationDialog';
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
        }));
    }
  };

  const handleEditStation = (stationId: number, stationData: StationFormData) => {
    if(authAdminId){
      dispatchRedux(updateStationDetails({
        stationId: stationId,
        stationFormData: stationData
      }));
    }
  };

  const handleDeleteStation = (stationId: number) => {
    dispatchRedux(deleteStation(stationId));
  };

  const handleToggleStationStatus = (stationId: number) => {
    dispatchRedux(toggleStation(stationId));
  };


  if (stationsLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
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
    <div className="bg-white rounded shadow-md h-[80vh] flex flex-col">
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
        <div className="flex-1">
          <div className="px-4 pt-4">
            <Tabs selected={selectedTab} onChange={setSelectedTab}>
              {uniqueStationTypes.map((type) => (
                <Tab key={type} label={type} value={type}>
                  <div className="max-h-[60vh] overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {
                        Object.values(stations)
                          .filter((station: StationDetailsResponse) => station.stationType === type)
                          .sort((a, b) =>
                            a.stationName.toLowerCase().localeCompare(b.stationName.toLowerCase())
                          )
                          .map((station: StationDetailsResponse) => (
                            <StationListItem 
                              key={station.stationId} 
                              stationDetails={station}
                              handleEditStation={handleEditStation}
                              handleDeleteStation={handleDeleteStation}
                              onToggleStationStatus={handleToggleStationStatus}
                            />
                      ))}
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
        onSubmit={handleAddStation} loading={false}      />
    </div>
  );
}

export default StationDetails; 