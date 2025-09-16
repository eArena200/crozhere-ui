'use client';

import { selectClubManagementState } from '@/redux/slices/club/management/clubManagementSlice';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ClubDetailsMobile from '@/components/club-management/mobile/club/ClubDetailsMobile';
import RateCardDetailsMobile from '@/components/club-management/mobile/rate/RateCardDetailsMobile';
import StationDetailsMobile from '@/components/club-management/mobile/station/StationDetailsMobile';

enum ActiveTab {
  CLUB,
  RATE,
  STATION
}

function CMMobileBody() {

    const [activeSection, setActiveSection] = useState<ActiveTab>(ActiveTab.CLUB);
    const cms = useSelector(selectClubManagementState);

    const clubList = cms.clubList;
    const selectedClubDetailsState = cms.selectedClubState.detailState;

    if(clubList.length <= 0){
        return (
            <div className='w-full min-h-[60vh] flex flex-col items-center justify-center gap-2 bg-white'>
                <Building2 size={100} color='gray'/>
                <span className='text-xl text-gray-600'> 
                    Register a club to get started.
                </span>
            </div>
        );
    }


    return (
        <div className='min-h-screen w-full mt-12'>
            <div className='fixed bg-white top-16 left-0 z-50 text-black w-full h-12 
                flex flex-row items-center justify-around shadow-md border-b border-gray-400'>
                <button
                    className={cn(
                    'text-center text-sm font-mono w-full h-12 rounded-t-md',
                    activeSection === ActiveTab.CLUB
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveTab.CLUB)}
                >
                    Club Details
                </button>
                <button
                    className={cn(
                    'text-center text-sm font-mono w-full h-12 rounded-t-md',
                    activeSection === ActiveTab.RATE
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveTab.RATE)}
                >
                    Rate Details
                </button>
                <button
                    className={cn(
                    'text-center text-sm font-mono w-full h-12 rounded-t-md',
                    activeSection === ActiveTab.STATION
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveTab.STATION)}
                >
                    Station Details
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {
                    activeSection === ActiveTab.CLUB && 
                    <ClubDetailsMobile 
                        details={selectedClubDetailsState.details}
                        detailsLoading={selectedClubDetailsState.clubDetailsLoading}
                        detailsError={selectedClubDetailsState.clubDetailsError} 
                    />
                }
                {
                    activeSection === ActiveTab.RATE && 
                    <RateCardDetailsMobile />
                }
                {
                    activeSection === ActiveTab.STATION && 
                    <StationDetailsMobile />
                }
            </div>
        </div>
    );
}

export default CMMobileBody;