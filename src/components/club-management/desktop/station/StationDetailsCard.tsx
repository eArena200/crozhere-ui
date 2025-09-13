'use client';

import React, { useState } from 'react';
import { 
  Pencil,Trash2,
  Power,Clock,
  Users, IndianRupee 
} from 'lucide-react';
import EditStationDialog from '@/components/club-management/EditStationDialog';
import { StationFormData } from '@/components/club-management/StationForm';
import { useSelector } from 'react-redux';
import { 
  deleteStation,
  selectSelectedClubStationState,
  toggleStation,
  updateStationDetails
} from '@/redux/slices/club/clubManagementSlice';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import { useDispatchRedux } from '@/redux/store';
import { StationDetailsResponse } from '@/api/club/model';
import DeleteStationDialog from '@/components/club-management/DeleteStationDialog';
import ToggleStationDialog from '@/components/club-management/ToggleStationDialog';

interface StationCardProps {
  stationDetails: StationDetailsResponse;
}

function StationCard({ 
  stationDetails
}: StationCardProps) {
  const dispatchRedux = useDispatchRedux();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);


  const { 
    updateStationLoading,
    updateStationError,
    deleteStationLoading,
    deleteStationError,
    toggleStationLoading,
    toggleStationError
  } = useSelector(selectSelectedClubStationState);

  const authAdminId = useSelector(selectAuthRoleBasedId);

  const handleEdit = (stationFormData: StationFormData) => {
    if (authAdminId) {
      dispatchRedux(updateStationDetails({
        stationId: stationDetails.stationId,
        stationFormData,
      }))
      .unwrap()
      .then(() => {
        setIsEditDialogOpen(false);
      })
      .catch((err) => {
        console.error('Update station failed:', err);
      });
    }
  }

  const handleDelete = (stationId: number) => {
    if(authAdminId){
      dispatchRedux(deleteStation(stationId))
      .unwrap()
      .then(() => {
        setIsDeleteDialogOpen(false);
      })
      .catch((err) => {
        console.error('Delete station failed:', err);
      });
    }
  }

  const handleToggle = async (stationId: number) => {
    if(authAdminId){
      dispatchRedux(toggleStation(stationId))
      .unwrap()
      .then(() => {
        setIsToggleDialogOpen(false);
      })
      .catch((err) => {
        console.error('Toggle station failed:', err);
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 relative border-2 border-blue-200 min-h-[160px] 
        flex flex-col shadow-xs shadow-blue-200 hover:shadow-lg hover:shadow-blue-300">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="pb-2 border-b-2 border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{stationDetails.stationName}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    stationDetails.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {stationDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-900">{stationDetails.stationDescription}</h3>
            </div>
            
            <div className="flex flex-col space-y-3 mt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={14} className="text-gray-400" />
                <span>{stationDetails.operatingHours.openTime} - {stationDetails.operatingHours.closeTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={14} className="text-gray-400" />
                <span>{stationDetails.capacity}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <IndianRupee size={14} className="text-gray-400" />
                <span>{stationDetails.rateName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            {/* Toggle Status Button */}
            <button
              onClick={() => setIsToggleDialogOpen(true)}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                stationDetails.isActive 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 border border-green-200 hover:shadow-sm hover:shadow-green-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 hover:shadow-sm hover:shadow-gray-400'
              }`}
              title={stationDetails.isActive ? 'Deactivate Station' : 'Activate Station'}
            >
              <Power size={16} />
            </button>

            {/* Edit Station Button */}
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors 
                duration-200 border border-blue-200 hover:shadow-sm hover:shadow-blue-300"
              title="Edit Station"
            >
              <Pencil size={16} />
            </button>

            {/* Delete Station Button */}
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors 
                duration-200 border border-red-200 hover:shadow-sm hover:shadow-red-300"
              title="Delete Station"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <EditStationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        initialData={mapStationDetailsToStationFormData(stationDetails)}
        loading={updateStationLoading}
        error={updateStationError}
      />

      <DeleteStationDialog 
        stationId={stationDetails.stationId} 
        loading={deleteStationLoading}  
        error={deleteStationError}
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onDelete={handleDelete}
      />

      <ToggleStationDialog 
        stationId={stationDetails.stationId} 
        currentStatus={stationDetails.isActive}
        isOpen={isToggleDialogOpen} 
        onClose={() => setIsToggleDialogOpen(false)} 
        onToggle={handleToggle}
        loading={toggleStationLoading}
        error={toggleStationError}
      />
    </>
  );
}

function mapStationDetailsToStationFormData(stationDetails: StationDetailsResponse)
  : StationFormData {
    const stationFormData: StationFormData = {
      stationName: stationDetails.stationName,
      stationDescription: stationDetails.stationDescription,
      stationType: stationDetails.stationType,
      openTime: stationDetails.operatingHours.openTime,
      closeTime: stationDetails.operatingHours.closeTime,
      rateId: stationDetails.rateId,
      capacity: stationDetails.capacity
    }
    return stationFormData;
}

export default React.memo(StationCard);
