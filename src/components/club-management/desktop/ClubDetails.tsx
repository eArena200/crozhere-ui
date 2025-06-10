'use client';

import React, { useEffect, useState } from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { useSelector } from 'react-redux';
import { useDispatchRedux } from '@/redux/store';
import { StationDetailsResponse } from '@/api/clubApi';
import { StationType } from '@/lib/types/station';
import StationCard from '@/components/club-management/desktop/StationCard';
import { Building2, Clock, MapPin, Plus, Pencil, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import AddStationDialog from '@/components/club-management/AddStationDialog';
import { StationFormData } from '../AddOrEditStationForm';
import { 
  fetchClubDetailsById,
  fetchStationsByClubId,
  selectClubManagementState
} from '@/redux/slices/club/clubManagementSlice';

function ClubDetails() {
  const dispatchRedux = useDispatchRedux();
  const {
    selectedClubId,
    loadingClubDetails,
    selectedClubDetails,
    clubDetailsError,
    loadingStations,
    selectedClubStationsDetails,
    stationDetailsError
  } = useSelector(selectClubManagementState);

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  const [isEditClubOpen, setIsEditClubOpen] = useState(false);

  useEffect(() => {
    if (selectedClubId) {
      dispatchRedux(fetchClubDetailsById(selectedClubId));
      dispatchRedux(fetchStationsByClubId(selectedClubId));
    }
  }, [dispatchRedux, selectedClubId]);

  const uniqueStationTypes: StationType[] = Array.from(
    new Set(selectedClubStationsDetails
        ?.map((station: StationDetailsResponse) => station.stationType))
  );

  useEffect(() => {
    if (uniqueStationTypes.length && !selectedTab) {
      setSelectedTab(uniqueStationTypes[0]);
    }
  }, [uniqueStationTypes, selectedTab]);

  const handleSaveStation = (stationData: StationFormData) => {
    console.log('Saving new station:', stationData);
  };

  const handleEditStation = (stationData: StationDetailsResponse) => {
    console.log('Editing station:', stationData);
  };

  const handleDeleteStation = (stationId: number) => {
    console.log('Deleting station:', stationId);
  };

  const handleToggleStationStatus = (stationId: number) => {
    console.log('Toggling station status:', stationId);
  };

  if (!selectedClubId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Select a club to view details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 w-full bg-gray-50 min-h-screen">
      {/* Club Header */}
      { loadingClubDetails ? (
          <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-sm text-gray-500">Loading Club Details</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-48 bg-gray-100">
              {selectedClubDetails?.coverImage ? (
                <img
                  src={selectedClubDetails?.coverImage}
                  alt="Club cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Building2 className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Club Info */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Logo */}
                <div className="relative -mt-16">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                    {selectedClubDetails?.logo ? (
                      <img
                        src={selectedClubDetails?.logo}
                        alt="Club logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Club Name and Status */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedClubDetails?.name}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                      Active
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  onClick={() => setIsEditClubOpen(true)}
                  variant="secondary"
                  className="flex items-center"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {/* Club Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {`${selectedClubDetails?.location?.city}, ${selectedClubDetails?.location?.state}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Operating Hours</p>
                    <p className="font-medium">
                      {`${selectedClubDetails?.openTime} - ${selectedClubDetails?.closeTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Stations</p>
                    <p className="font-medium">{selectedClubStationsDetails?.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) 
      }

      {/* Stations Section */}
      { loadingStations ? (
          <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-sm text-gray-500">Loading Stations...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Stations</h2>
                <p className="text-gray-500 mt-1">Manage your club's stations</p>
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
              <Tabs selected={selectedTab} onChange={setSelectedTab}>
                {uniqueStationTypes.map((type) => (
                  <Tab key={type} label={type} value={type}>
                    <div className="overflow-y-auto h-[600px] pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedClubStationsDetails
                          ?.filter((station: StationDetailsResponse) => station.stationType === type)
                          .map((station: StationDetailsResponse) => (
                            <StationCard 
                              key={station.stationId} 
                              station={station}
                              onEdit={handleEditStation}
                              onDelete={handleDeleteStation}
                              onToggleStatus={handleToggleStationStatus}
                            />
                        ))}
                      </div>
                    </div>      
                  </Tab>
                ))}
              </Tabs>
            )}
          </div>
        )
      }

      <AddStationDialog 
        isOpen={isAddStationOpen} 
        onClose={() => setIsAddStationOpen(false)} 
        onSubmit={handleSaveStation}        
      />

    </div>
  );
}

export default ClubDetails;
