'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClubState } from '@/redux/slices/club/clubSlice';
import ClubListItem from './ClubListItem';

interface ClubListProps {
    isMobile?: boolean;
}

function ClubList({ isMobile = false }: ClubListProps) {
    const { clubs, loading, error } = useSelector(selectClubState);
        
    if (loading) {
        return <p>Loading clubs...</p>;
    }

    if (error) {
        return <p className="text-red-600 text-sm">Error: {error}</p>;
    }

    if (clubs.length === 0) {
        return <p className="text-sm">No clubs found.</p>;
    }

    return (
        <div className="bg-white overflow-y-auto flex-1 space-y-2 p-2 rounded-sm">
            <ul className={isMobile ? 'space-y-1' : 'space-y-2'}>
                {clubs.map((club) => (
                <ClubListItem key={club.clubId} club={club} isMobile={isMobile} />
                ))}
            </ul>
        </div>
    );
}

export default ClubList;
