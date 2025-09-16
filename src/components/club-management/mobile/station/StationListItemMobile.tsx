'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Power, Clock, Users } from 'lucide-react';
import EditStationDialog from '@/components/club-management/components/dialog/EditStationDialog';
import { StationFormData } from '@/components/club-management/components/forms/StationForm';
import { StationDetailsResponse } from '@/api/club/model';

interface StationListItemProps {
  stationDetails: StationDetailsResponse;
  handleEditStation: (stationId: number, stationFormData: StationFormData) => void;
  handleDeleteStation: (stationId: number) => void;
  onToggleStationStatus: (stationId: number) => void;
}

function StationListItem({ stationDetails, handleEditStation, handleDeleteStation, onToggleStationStatus }: StationListItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (stationFormData: StationFormData) => {
    handleEditStation(stationDetails.stationId, stationFormData);
  };

  const handleDelete = (stationId: number) => {
    handleDeleteStation(stationId);
  }

  const handleToggle = (stationId: number) => {
    onToggleStationStatus(stationId);
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 relative border border-gray-200">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-gray-900">{stationDetails.stationName}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      stationDetails.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {stationDetails.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(
                      <button
                        onClick={() => handleToggle(stationDetails.stationId)}
                        className={`p-1.5 rounded-full transition-colors duration-200 ${
                          stationDetails.isActive 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title={stationDetails.isActive ? 'Deactivate Station' : 'Activate Station'}
                      >
                        <Power size={16} />
                      </button>
                    )}
                    {(
                      <button
                        onClick={() => setIsEditDialogOpen(true)}
                        className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 border border-blue-200"
                        title="Edit Station"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {(
                      <button
                        onClick={() => handleDelete(stationDetails.stationId)}
                        className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 border border-red-200"
                        title="Delete Station"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  <span>{stationDetails.operatingHours.openTime} - {stationDetails.operatingHours.closeTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  <span>{stationDetails.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditStationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        initialData={mapStationDetailsToStationFormData(stationDetails)} loading={false}      />
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
      capacity: stationDetails.capacity,
      rateId: stationDetails.rateId
    }
    return stationFormData;
}

export default React.memo(StationListItem); 