'use client';

import React from 'react';
import StationListItem from '@/components/club-management/mobile/StationListItem';
import { StationDetailsResponse } from '@/api/clubApi';

interface StationListProps {
  stations: StationDetailsResponse[];
  isLoading?: boolean;
  error?: string;
  onEdit?: (station: StationDetailsResponse) => void;
  onDelete?: (stationId: number) => void;
  onToggleStatus?: (stationId: number) => void;
}

function StationList({ stations, isLoading, error, onEdit, onDelete, onToggleStatus }: StationListProps) {
  if (isLoading) {
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">No stations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stations.map((station) => (
        <StationListItem 
          key={station.stationId} 
          station={station}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}

export default StationList; 