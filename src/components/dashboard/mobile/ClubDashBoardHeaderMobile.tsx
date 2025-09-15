'use client';

import Button from '@/components/ui/Button';

import { useDispatchRedux } from '@/redux/store';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import ClubBookingFlow from '@/components/club-booking/ClubBookingFlow';
import { 
  selectClubDashboardState, 
  setSelectedClubAndFetchDetails 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';

function ClubDashBoardHeaderMobile() {
  const dispatchRedux = useDispatchRedux();
  const { clubs, selectedClubId } = useSelector(selectClubDashboardState);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleClubSelect = (clubId: number) => {
    dispatchRedux(setSelectedClubAndFetchDetails(clubId));
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 h-16 flex items-center justify-between">
      {/* Club Dropdown */}
      <div className="relative">
        <select
          value={selectedClubId || ''}
          onChange={(e) => handleClubSelect(Number(e.target.value))}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-600 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {
            Object.values(clubs).map((club) => (
              <option key={club.clubId} value={club.clubId}>
                {club.clubName}
              </option>
            ))
          }
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {
        selectedClubId ? (
          <Button
            variant='primary'
            onClick={() => setIsBookingModalOpen(true)}
          >
            New Booking
          </Button>
        ) : ( <> </>)
      }
      {
        selectedClubId && (
          <Dialog open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} className="relative z-70">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-2">
              <Dialog.Panel className="w-full max-w-screen max-h-[80vh] overflow-y-auto rounded-md bg-white shadow-xl">
                <ClubBookingFlow clubId={selectedClubId} closeFlowHandler={() => {setIsBookingModalOpen(false)}}/>
              </Dialog.Panel>
            </div>
          </Dialog>
        )
      }
    </div>
  );
}

export default ClubDashBoardHeaderMobile;