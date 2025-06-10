'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ClubListItem from './ClubListItem';
import { Building2, Search } from 'lucide-react';
import { useDispatchRedux } from '@/redux/store';
import { 
    selectClubManagementState,
    setSelectedClubId,
} from '@/redux/slices/club/clubManagementSlice';

function ClubList() {
    const dispatchRedux = useDispatchRedux();

    const { 
        clubList, 
        selectedClubId, 
        loadingClubList, 
        clubListError 
    } = useSelector(selectClubManagementState);

    const [searchQuery, setSearchQuery] = useState('');
    const filteredClubs = clubList.filter(club => 
        club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClubSelect = (clubId: number) => {
        dispatchRedux(setSelectedClubId(clubId));
    };

    if (loadingClubList) {
        return (
            <div className="flex flex-col items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-sm text-gray-500">Loading clubs...</p>
            </div>
        );
    }

    if (clubListError) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <span className="text-red-500 text-xl">!</span>
                </div>
                <p className="text-red-600 text-sm font-medium">Error loading clubs</p>
                <p className="text-gray-500 text-xs mt-1">{clubListError}</p>
            </div>
        );
    }

    if (clubList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-900 text-sm font-medium">No clubs found</p>
                <p className="text-gray-500 text-xs mt-1">Register a new club to get started</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border text-gray-400 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Club List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredClubs.map((club) => (
                    <ClubListItem 
                        key={club.clubId} 
                        clubMetaData={club}
                        isSelected={club.clubId === selectedClubId}
                        onSelect={() => handleClubSelect(club.clubId)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ClubList;
