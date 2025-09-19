'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Plus } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Button from '@/components/ui/Button';
import ClubBookingFlow from '@/components/new-booking/ClubBookingFlow';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { 
  selectClubBookingsState,
  setSelectedClubAndFetchDetails
} from '@/redux/slices/club/booking/clubBookingsListSlice';

function CBMobileHeader() {
  const dispatchRedux = useDispatchRedux();
  const { clubList, selectedClubId } = useSelector(selectClubBookingsState);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const handleClubSelect = (clubId: number) => {
    dispatchRedux(setSelectedClubAndFetchDetails(clubId));
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-70 bg-white shadow-md px-4 h-16 flex items-center">
        {
          clubList.length === 0 ? (
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Bookings</h1>
                <p className="text-sm text-gray-500 mt-0.5">View and manage your bookings</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row w-full items-center justify-between space-x-4">
              {/* Club Dropdown */}
              <div className="relative">
                <select
                  value={selectedClubId || ''}
                  onChange={(e) => handleClubSelect(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {clubList.map((club) => (
                    <option key={club.clubId} value={club.clubId}>
                      {club.clubName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <Button
                variant='primary'
                onClick={() => setIsBookingModalOpen(true)}
                className='flex items-center space-x-2 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200'
              >
                <Plus className="w-4 h-4"/>
                <span> New Booking </span>
              </Button>
            </div>
          )
        }
        {
          selectedClubId && (
            <Dialog open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} className="relative z-70">
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-md bg-white shadow-xl">
                  <ClubBookingFlow clubId={selectedClubId} closeFlowHandler={() => {setIsBookingModalOpen(false)}}/>
                </Dialog.Panel>
              </div>
            </Dialog>
          )
        }
    </div>
  );
}

export default CBMobileHeader;
