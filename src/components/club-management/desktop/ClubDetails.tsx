'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatchRedux } from '@/redux/store';
import { Building2, Clock, MapPin, Pencil, CheckCircle2, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { 
  fetchClubDetailsById,
  selectClubManagementState,
  updateClubDetails
} from '@/redux/slices/club/clubManagementSlice';
import EditClubDialog from '../EditClubDialog';
import { ClubFormData } from '../CreateOrEditClubForm';
import { ClubDetailsResponse } from '@/api/clubManagementApi';
import { selectAuthClubAdminId } from '@/redux/slices/auth/authSlice';

function ClubDetails() {
  const dispatchRedux = useDispatchRedux();
  const {
    selectedClubId,
    loadingClubDetails,
    selectedClubDetails,
    clubDetailsError,
  } = useSelector(selectClubManagementState);

  const authClubAdminId = useSelector(selectAuthClubAdminId);

  const [isEditClubOpen, setIsEditClubOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (selectedClubId) {
      dispatchRedux(fetchClubDetailsById(selectedClubId));
    }
  }, [dispatchRedux, selectedClubId]);

  const handleUpdateClub = (updatedClubData: ClubFormData) => {
    if(selectedClubId && authClubAdminId){
      dispatchRedux(updateClubDetails({
        clubId: selectedClubId,
        clubAdminId: authClubAdminId,
        updatedClubData: updatedClubData
      }));
    }
  }

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

  if(loadingClubDetails){
    <div className="flex flex-col items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-sm text-gray-500">Loading Club Details</p>
    </div>
  }

  if(clubDetailsError){
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-600 text-sm font-medium">Error loading club details</p>
          <p className="text-gray-500 text-xs mt-1">{clubDetailsError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-gray-100 rounded border-gray-300 border-2">
      {/* Club Header with Chevron */}
      <div 
        className="flex items-center justify-between p-4 bg-white rounded-t cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">Club Details</h2>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
        />
      </div>

      {/* Club Content */}
      {isExpanded && (
        <div className="bg-white rounded-b shadow-md overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 bg-gray-100">
            {selectedClubDetails?.coverImage ? (
              <img
                src={selectedClubDetails?.coverImage}
                alt="Club cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-400">
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
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Building2 className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Club Name and Status */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClubDetails?.clubName}</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verified
                  </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-700">
                    {`${selectedClubDetails?.clubAddress?.city}, ${selectedClubDetails?.clubAddress?.state}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Operating Hours</p>
                  <p className="font-medium text-gray-700">
                    {`${selectedClubDetails?.operatingHours.openTime} - ${selectedClubDetails?.operatingHours.closeTime}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedClubDetails && (
        <EditClubDialog 
          isOpen={isEditClubOpen}
          onClose={() => setIsEditClubOpen(false)} 
          onUpdate={handleUpdateClub} 
          initialData={getFormDataFromClubDetails(selectedClubDetails)}      
        />
      )}
    </div>
  );
}


function getFormDataFromClubDetails(clubDetails: ClubDetailsResponse) : ClubFormData {
  return {
    clubName: clubDetails.clubName,
    address: {
      street: clubDetails.clubAddress.streetAddress,
      city: clubDetails.clubAddress.city,
      state: clubDetails.clubAddress.state,
      pincode: clubDetails.clubAddress.pinCode,
      coordinates: {
        latitude: clubDetails.clubAddress.geoLocation?.latitude,
        longitude: clubDetails.clubAddress.geoLocation?.longitude,
      }
    },
    openTime: clubDetails.operatingHours.openTime,
    closeTime: clubDetails.operatingHours.closeTime,
    primaryContact: clubDetails.primaryContact,
    secondaryContact: clubDetails.secondaryContact
  };
}

export default ClubDetails;
