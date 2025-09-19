'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedClubBookingsState } from '@/redux/slices/club/booking/clubBookingsListSlice';
import { TicketX } from 'lucide-react';
import BookingsActionBarMobile from '@/components/club-bookings/mobile/BookingActionBarMobile';
import BookingsList from '@/components/club-bookings/mobile/BookingsList';

function CBMobileBody() {
  const {
    bookingsListColumns,
    bookingList,
    paginationState
  } = useSelector(selectSelectedClubBookingsState);

  

  return (
    <div className='flex flex-col min-h-[90vh] px-4 py-2 justify-start items-start'>
        <BookingsActionBarMobile />
        {
          bookingList.length === 0 ? (
            <div className='w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-1 bg-white'>
              <TicketX size={100} color='gray'/>
              <span className='text-xl text-gray-700'> 
                No bookings found.
              </span>
            </div>
          ) : (
            <BookingsList 
              bookings={bookingList} 
              paginationState={paginationState} 
              viewColumns={bookingsListColumns} 
            />
          )
        }
    </div>
  )
}

export default CBMobileBody;