'use client';

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchClubDetailsById,
  fetchStationsByClubId,
  selectSelectedClubDetails,
  selectSelectedClubStationDetails,
  selectLoadingClubDetails,
  selectLoadingStations,
  selectClubDetailsError,
  selectStationError,
} from "@/redux/slices/club/clubManagementSlice";
import { useDispatchRedux } from "@/redux/store";
import { Building2, MapPin, Clock, AlertCircle, 
  Loader2, CheckCircle2, Pencil } from "lucide-react";
import StationList from "./StationList";
import Button from "@/components/ui/Button";
import { StationType } from "@/lib/types/station";
import { StationDetailsResponse } from "@/api/clubManagementApi";
import AddStationDialog from "@/components/club-management/AddStationDialog";

interface ClubDetailsMobileProps {
  clubId: number;
}

function ClubDetailsMobile({ clubId }: ClubDetailsMobileProps) {
  const dispatchRedux = useDispatchRedux();
  const selectedClubDetails = useSelector(selectSelectedClubDetails);
  const selectedClubStations = useSelector(selectSelectedClubStationDetails);
  const loadingClubDetails = useSelector(selectLoadingClubDetails);
  const loadingStations = useSelector(selectLoadingStations);
  const clubDetailsError = useSelector(selectClubDetailsError);
  const stationError = useSelector(selectStationError);
  const [selectedTypes, setSelectedTypes] = useState<StationType[]>([]);
  const [uniqueStationTypes, setUniqueStationTypes] = useState<StationType[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddStationDialogOpen, setIsAddStationDialogOpen] = useState(false);

  useEffect(() => {
    dispatchRedux(fetchClubDetailsById(clubId));
    dispatchRedux(fetchStationsByClubId(clubId));
  }, [dispatchRedux, clubId]);

  // Update unique station types when stations change
  useEffect(() => {
    if (selectedClubStations) {
      const types = Array.from(
        new Set(selectedClubStations.map((station) => station.stationType))
      );
      setUniqueStationTypes(types);
    }
  }, [selectedClubStations]);

  // Set first station type as selected by default
  useEffect(() => {
    if (uniqueStationTypes.length > 0 && selectedTypes.length === 0) {
      setSelectedTypes([uniqueStationTypes[0]]);
    }
  }, [uniqueStationTypes, selectedTypes]);

  const handleEditStation = (stationData: StationDetailsResponse) => {
    console.log('Editing station:', stationData);
  };

  const handleDeleteStation = (stationId: number) => {
    console.log('Deleting station:', stationId);
  };

  const handleToggleStationStatus = (stationId: number) => {
    console.log('Toggling station status:', stationId);
  };

  const toggleStationType = (type: StationType) => {
    setSelectedTypes([type]);
  };

  const handleAddStation = async (data: any) => {
    console.log('Adding new station:', data);
  };

  if (loadingClubDetails) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-600">Loading club details...</p>
      </div>
    );
  }

  if (clubDetailsError) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center space-y-4 p-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium text-center">
          {clubDetailsError}
        </p>
      </div>
    );
  }

  if (!selectedClubDetails) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center space-y-4 p-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-center">No club selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Club Details Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-200">
        {/* Cover Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
          {selectedClubDetails.coverImage ? (
            <img
              src={selectedClubDetails.coverImage}
              alt={`${selectedClubDetails.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Club Info Section */}
        <div className="px-4 py-4">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="relative -mt-16">
              <div className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
                {selectedClubDetails.logo ? (
                  <img
                    src={selectedClubDetails.logo}
                    alt={`${selectedClubDetails.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Club Name and Basic Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClubDetails.name}</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200 flex items-center w-fit mt-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="p-2"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{selectedClubDetails.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{selectedClubDetails.openTime} - {selectedClubDetails.closeTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-200">
        <div className="p-2">
          <div className="flex items-center justify-between mb-4 p-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stations</h3>
              <p className="text-sm text-gray-500 mt-1">Manage your club's stations</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsAddStationDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <span>Add Station</span>
            </Button>
          </div>

          {/* Station Type Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {uniqueStationTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleStationType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-white text-gray-900 border border-blue-600 hover:bg-blue-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-[60vh] overflow-y-auto p-4">
              <StationList 
                stations={(selectedClubStations || []).filter(station => selectedTypes.includes(station.stationType))}
                isLoading={loadingStations}
                error={stationError}
                onEdit={handleEditStation}
                onDelete={handleDeleteStation}
                onToggleStatus={handleToggleStationStatus}
              />
            </div>
          </div>
        </div>
      </div>

      <AddStationDialog
        isOpen={isAddStationDialogOpen}
        onClose={() => setIsAddStationDialogOpen(false)}
        onSubmit={handleAddStation}
      />
    </div>
  );
}

export default ClubDetailsMobile;
