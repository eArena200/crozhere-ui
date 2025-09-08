'use client';

import React, { useEffect, useState } from 'react';
import { useDispatchRedux } from '@/redux/store';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import ClubDetails from '@/components/club-management/desktop/ClubDetails';
import StationDetails from '@/components/club-management/desktop/StationDetails';
import { ClubFormData } from '@/components/club-management/ClubForm';
import { 
  createNewClub,
  fetchClubIdsForAdminId
} from '@/redux/slices/club/clubManagementSlice';
import { useSelector } from 'react-redux';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import CMDesktopHeader from '@/components/club-management/desktop/CMDesktopHeader';
import RateCardDetails from '@/components/club-management/desktop/RateCardDetails';
import { cn } from '@/lib/utils';

enum ActiveSection {
  CLUB,
  RATE,
  STATION
}

function ClubManagementDesktop() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>(ActiveSection.CLUB);

  useEffect(() => {
    if (authAdminId) {
      dispatchRedux(fetchClubIdsForAdminId());
    }
  }, [dispatchRedux, authAdminId]);

  if (!authAdminId) {
    return <div>Unauthorized</div>;
  }

  const handleCreateClub = (clubData: ClubFormData) => {
    dispatchRedux(createNewClub({ clubFormData: clubData }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full">
      {/* Header */}
      <CMDesktopHeader onClickCreateNewClub={() => setIsDialogOpen(true)} />

      {/* Body with sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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
        <div className="flex-1 overflow-y-auto p-2">
          {activeSection === ActiveSection.CLUB && <ClubDetails />}
          {activeSection === ActiveSection.RATE && <RateCardDetails />}
          {activeSection === ActiveSection.STATION && <StationDetails />}
        </div>
      </div>

      {/* Create Club Dialog */}
      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateClub}
      />
    </div>
  );
}

export default ClubManagementDesktop;
