'use client';

import React from 'react';
import { Building2, MapPin, Clock, CheckCircle2 } from 'lucide-react';

interface ClubListItemProps {
    isSelected?: boolean;
    club: {
        clubId: number;
        name: string;
        logo?: string;
        location?: string;
        openTime?: string;
        closeTime?: string;
    };
    isMobile?: boolean;
    onSelect?: () => void;
}

function ClubListItem({
    isSelected = false,
    club,
    isMobile = false,
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
            {/* Club Logo */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden mr-4">
                {club.logo ? (
                    <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Club Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {club.name}
                    </h3>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                    </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {club.location && (
                        <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{club.location}</span>
                        </div>
                    )}
                    {club.openTime && club.closeTime && (
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{club.openTime} - {club.closeTime}</span>
                        </div>
                    )}
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
