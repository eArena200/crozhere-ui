'use client';

import React from 'react';
import { Building2, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { ClubMetaData } from '@/redux/slices/club/clubManagementSlice';

interface ClubListItemProps {
    isSelected?: boolean;
    clubMetaData: ClubMetaData
    onSelect?: () => void;
}

function ClubListItem({
    isSelected = false,
    clubMetaData,
    onSelect
}: ClubListItemProps) {
    return (
        <div 
            onClick={onSelect}
            className={`group relative flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer
                ${isSelected 
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >
            {/* Club Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {clubMetaData.clubName}
                    </h3>
                </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-lg" />
            )}
        </div>
    );
}

export default ClubListItem;
