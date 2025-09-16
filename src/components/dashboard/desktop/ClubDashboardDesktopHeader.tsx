'use client';

import Button from '@/components/ui/Button';

import { useDispatchRedux } from '@/redux/store';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import ClubBookingFlow from '@/components/new-booking/ClubBookingFlow';
import { 
  selectClubDashboardState, 
  setSelectedClubAndFetchDetails 
} from '@/redux/slices/club/dashboard/clubDashboardSlice';

function ClubDashboardDesktopHeader() {
  const dispatchRedux = useDispatchRedux();
  const { clubs, selectedClubId } = useSelector(selectClubDashboardState);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleClubSelect = (clubId: number) => {
    dispatchRedux(setSelectedClubAndFetchDetails(clubId));
  }

  return (
    <div className='flex flex-1 w-full h-16 bg-white items-center justify-between px-2'>
      <div className='w-1/3 flex flex-1 h-full items-center'>
        {
          selectedClubId && clubs[selectedClubId] ? (
            <span className='text-3xl font-bold text-gray-700'>
              {clubs[selectedClubId].clubName}
            </span>
          ) : (
            <></>
          )
        }
      </div>
      <div className='w-2/3 flex flex-1 h-full items-center justify-end space-x-2'>
        {/* Club Dropdown */}
        <div className="relative">
          <select
            value={selectedClubId || ''}
            onChange={(e) => handleClubSelect(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a club</option>
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
              + New Booking
            </Button>
          ) : ( <> </>)
        }
        {
          selectedClubId && (
            <Dialog open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} className="relative z-70">
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-2">
                <Dialog.Panel className="w-full max-w-[50vw] max-h-[90vh] overflow-y-auto rounded-md bg-white shadow-xl">
                  <ClubBookingFlow clubId={selectedClubId} closeFlowHandler={() => {setIsBookingModalOpen(false)}}/>
                </Dialog.Panel>
              </div>
            </Dialog>
          )
        }
        
      </div>
    </div>
  )
}

export default ClubDashboardDesktopHeader;