import React, { useState } from 'react';
import { cn } from '@/lib/utils';

import RateCardDetails from '@/components/club-management/desktop/rate/RateCardDetails';
import ClubDetails from '@/components/club-management/desktop/club/ClubDetails';
import StationDetails from '@/components/club-management/desktop/station/StationDetails';
import { useSelector } from 'react-redux';
import { selectClubManagementState } from '@/redux/slices/club/management/clubManagementSlice';
import { Building2 } from 'lucide-react';

enum ActiveSection {
  CLUB,
  RATE,
  STATION
}

function CMDesktopBody() {
    const [activeSection, setActiveSection] = useState<ActiveSection>(ActiveSection.CLUB);
    const cms = useSelector(selectClubManagementState);

    const clubList = cms.clubList;
    const selectedClubDetailsState = cms.selectedClubState.detailState;
    {/* No club present */}
    if(clubList.length <= 0){
        return (
            <div className='w-full h-full flex flex-col items-center justify-center gap-2 bg-white'>
                <Building2 size={100} color='gray'/>
                <span className='text-xl text-gray-600'> 
                    Register a club to get started.
                </span>
            </div>
        );
    }


    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col gap-2">
                <button
                    className={cn(
                    'px-3 py-2 rounded-md text-left font-medium',
                    activeSection === ActiveSection.CLUB
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveSection.CLUB)}
                >
                    Club Details
                </button>
                <button
                    className={cn(
                    'px-3 py-2 rounded-md text-left font-medium',
                    activeSection === ActiveSection.RATE
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveSection.RATE)}
                >
                    Rate Details
                </button>
                <button
                    className={cn(
                    'px-3 py-2 rounded-md text-left font-medium',
                    activeSection === ActiveSection.STATION
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    )}
                    onClick={() => setActiveSection(ActiveSection.STATION)}
                >
                    Station Details
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-2">
                {
                    activeSection === ActiveSection.CLUB && 
                    <ClubDetails 
                        details={selectedClubDetailsState.details}
                        detailsLoading={selectedClubDetailsState.clubDetailsLoading}
                        detailsError={selectedClubDetailsState.clubDetailsError}    
                    />
                }
                {
                    activeSection === ActiveSection.RATE && 
                    <RateCardDetails />
                }
                {
                    activeSection === ActiveSection.STATION && 
                    <StationDetails />
                }
            </div>
        </div>
    )
}

export default CMDesktopBody;