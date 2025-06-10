'use client';

import React, { useState } from 'react';
import { StationDetailsResponse } from '@/api/clubApi';
import { StationType } from '@/lib/types/station';
import { Pencil, Trash2, Power, Clock, IndianRupee } from 'lucide-react';
import EditStationDialog from '@/components/club-management/EditStationDialog';

interface StationListItemProps {
  station: StationDetailsResponse;
  onEdit?: (station: StationDetailsResponse) => void;
  onDelete?: (stationId: number) => void;
  onToggleStatus?: (stationId: number) => void;
}

function StationListItem({ station, onEdit, onDelete, onToggleStatus }: StationListItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditStation = () => {
    console.log("EditStation Clicked");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 relative border border-gray-200">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-gray-900">{station.stationName}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      station.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {station.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onToggleStatus && (
                      <button
                        onClick={() => onToggleStatus(station.stationId)}
                        className={`p-1.5 rounded-full transition-colors duration-200 ${
                          station.isActive 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title={station.isActive ? 'Deactivate Station' : 'Activate Station'}
                      >
                        <Power size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => setIsEditDialogOpen(true)}
                        className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 border border-blue-200"
                        title="Edit Station"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(station.stationId)}
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
                  <span>{'station.openTime'} - {'station.closeTime'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <IndianRupee size={14} className="text-gray-400" />
                  <span>₹{'station.pricePerHour'}/hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StationListItem; 