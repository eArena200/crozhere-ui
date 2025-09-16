'use client';

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatchRedux } from '@/redux/store';
import { Building2, Clock, MapPin, Pencil, CheckCircle2, TriangleAlert, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { 
  selectSelectedClubDetailState,
  updateClubDetails
} from '@/redux/slices/club/management/clubManagementSlice';
import EditClubDialog from '@/components/club-management/components/dialog/EditClubDialog';
import { ClubFormData } from '@/components/club-management/components/forms/ClubForm';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { ClubResponse } from '@/api/club/model';

export interface ClubDetailsProps {
  details?: ClubResponse;
  detailsLoading: boolean;
  detailsError?: string;
}

function ClubDetails(props: ClubDetailsProps) {
  const dispatchRedux = useDispatchRedux();
  const { 
    details, 
    detailsLoading, 
    detailsError 
  } = props;

  const {
    updateClubLoading,
    updateClubError
  } = useSelector(selectSelectedClubDetailState);

  const authClubAdminId = useSelector(selectAuthRoleBasedId);
  const [isEditClubOpen, setIsEditClubOpen] = useState(false);
  const initialFormData = useMemo(() => {
    return details ? getFormDataFromClubDetails(details) : null;
  }, [details]);

  const handleUpdateClub = (updatedClubData: ClubFormData) => {
    if(authClubAdminId && details){
      dispatchRedux(updateClubDetails({
        clubId: details.clubId,
        updatedClubData: updatedClubData
      }))
      .unwrap()
      .then(() => {
        setIsEditClubOpen(false);
      })
      .catch((err) => {
        console.error("Failed to update club:", err);
      });
    }
  }

  if(detailsLoading){
    //TODO: Replace it with a good looking loader.
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-sm text-gray-500">Loading Club Details</p>
      </div>
    );
  }

  if(detailsError){
    // TODO: Replace it with a good design.
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <TriangleAlert className='text-red-400 h-30 w-30 mb-3'/>
        <p className="text-red-600 font-medium text-xl">Error loading club details</p>
        <p className="text-gray-500 text-sm mt-1">{detailsError}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md overflow-y-auto h-full">
        {/* Cover Image */}
        <div className="relative h-64 bg-gray-100">
          {details?.coverImage ? (
            <img
              src={details?.coverImage}
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
                {details?.logo ? (
                  <img
                    src={details?.logo}
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{details?.clubName}</h2>
                  <h2 className="text-md font-mono text-gray-700">{details?.clubDescription}</h2>
                </div>
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
              Edit details
            </Button>
          </div>

          {/* Club Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs md:text-md lg:text-md text-gray-500">Location</p>
                <p className="text-md md:text-md lg:text-md font-medium text-gray-700">
                  {`${details?.clubAddress?.streetAddress}, ${details?.clubAddress?.area}`}
                </p>
                <p className="text-md md:text-md lg:text-md font-medium text-gray-700">
                  {`${details?.clubAddress?.city}, ${details?.clubAddress?.state}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs md:text-md lg:text-md text-gray-500">Operating Hours</p>
                <p className="text-md md:text-md lg:text-md font-medium text-gray-700">
                  {`${details?.operatingHours.openTime} - ${details?.operatingHours.closeTime}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs md:text-md lg:text-md text-gray-500">Contact</p>
                <p className="text-md md:text-md lg:text-md font-mono text-gray-700">
                  {`${details?.primaryContact}, ${details?.secondaryContact}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      {initialFormData && (
        <EditClubDialog 
          isOpen={isEditClubOpen}
          onClose={() => setIsEditClubOpen(false)} 
          onSubmit={handleUpdateClub} 
          initialData={initialFormData}
          loading={updateClubLoading}
          error={updateClubError}
        />
      )}
    </div>
  );
}


function getFormDataFromClubDetails(clubDetails: ClubResponse) : ClubFormData {
  return {
    clubName: clubDetails.clubName,
    clubDescription: clubDetails.clubDescription,
    address: {
      street: clubDetails.clubAddress.streetAddress,
      area: clubDetails.clubAddress.area,
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
