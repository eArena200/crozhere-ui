'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchClubDetailsById,
  selectClubManagementState,
  updateClubDetails,
} from "@/redux/slices/club/clubManagementSlice";
import { useDispatchRedux } from "@/redux/store";
import { Building2, MapPin, Clock, AlertCircle, 
  Loader2, CheckCircle2, Pencil, 
  ChevronDown} from "lucide-react";
import Button from "@/components/ui/Button";
import { ClubDetailsResponse } from "@/api/clubManagementApi";
import { selectAuthClubAdminId } from "@/redux/slices/auth/authSlice";
import { ClubFormData } from "@/components/club-management/ClubForm";
import EditClubDialog from "@/components/club-management/EditClubDialog";

function ClubDetailsMobile() {
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
  
    const initialFormData = useMemo(() => {
      return selectedClubDetails ? getFormDataFromClubDetails(selectedClubDetails) : null;
    }, [selectedClubDetails]);
  
    const handleUpdateClub = (updatedClubData: ClubFormData) => {
      if(authClubAdminId && selectedClubId){
        dispatchRedux(updateClubDetails({
          clubId: selectedClubId,
          clubAdminId: authClubAdminId,
          updatedClubData: updatedClubData
        }));
      }
    }

  if (!selectedClubId) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center space-y-4 p-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-center">No club selected</p>
      </div>
    );
  }

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

      
      {/* Club Details Card */}
      { isExpanded && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-200">
          {/* Cover Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
            {selectedClubDetails?.coverImage ? (
              <img
                src={selectedClubDetails.coverImage}
                alt={`${selectedClubDetails.clubName} cover`}
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
                  {selectedClubDetails?.logo ? (
                    <img
                      src={selectedClubDetails.logo}
                      alt={`${selectedClubDetails.clubName} logo`}
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
                    <h2 className="text-2xl font-bold text-gray-900">{selectedClubDetails?.clubName}</h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200 flex items-center w-fit mt-1">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditClubOpen(true)}
                    className="p-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{selectedClubDetails?.clubAddress.city}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{selectedClubDetails?.operatingHours.openTime} - {selectedClubDetails?.operatingHours.closeTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {initialFormData && (
        <EditClubDialog 
          isOpen={isEditClubOpen}
          onClose={() => setIsEditClubOpen(false)} 
          onSubmit={handleUpdateClub} 
          initialData={initialFormData}      
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

export default ClubDetailsMobile;
