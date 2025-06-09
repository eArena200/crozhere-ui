'use client';

import React, { useState } from 'react';
import { StationResponse } from '@/api/clubApi';
import { StationType } from '@/lib/types/station';
import { Pencil, Trash2, Power, Clock, IndianRupee } from 'lucide-react';
import EditStationDialog from '@/components/club-management/EditStationDialog';

interface StationCardProps {
  station: StationResponse;
  onEdit?: (station: StationResponse) => void;
  onDelete?: (stationId: number) => void;
  onToggleStatus?: (stationId: number) => void;
}

function StationCard({ station, onEdit, onDelete, onToggleStatus }: StationCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getStationTypeColor = (type: StationType) => {
    const colors = {
      SNOOKER: 'bg-green-100 text-green-800 border border-green-200',
      POOL: 'bg-blue-100 text-blue-800 border border-blue-200',
      PC: 'bg-purple-100 text-purple-800 border border-purple-200',
      PS4: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      XBOX: 'bg-red-100 text-red-800 border border-red-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  // Hardcoded values for now
  const startTime = "09:00 AM";
  const endTime = "11:00 PM";
  const pricePerHour = 250; // Hardcoded price in INR

  const handleEdit = (data: any) => {
    if (onEdit) {
      onEdit({ ...station, ...data });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-200 relative border border-gray-200 min-h-[160px] flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="pb-3 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{station.stationName}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    station.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {station.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={14} className="text-gray-400" />
                <span>{startTime} - {endTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <IndianRupee size={14} className="text-gray-400" />
                <span>₹{pricePerHour}/hour</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
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

      <EditStationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEdit}
        station={station}
      />
    </>
  );
}

export default StationCard;
