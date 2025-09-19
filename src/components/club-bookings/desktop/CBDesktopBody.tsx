'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { TicketX } from 'lucide-react';
import { selectSelectedClubBookingsState } from '@/redux/slices/club/booking/clubBookingsListSlice';
import BookingsActionBar from '@/components/club-bookings/desktop/BookingsActionBar';
import BookingsTable from '@/components/club-bookings/desktop/BookingsTable';

function CBDesktopBody() {
  const {
    bookingsListColumns,
    bookingList,
    paginationState
  } = useSelector(selectSelectedClubBookingsState);

  return (
    <div className='flex flex-col min-h-[90vh] px-4 py-2 justify-start items-start'>
        <BookingsActionBar />
        {
          bookingList.length === 0 ? (
            <div className='w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-1 bg-white'>
              <TicketX size={100} color='gray'/>
              <span className='text-xl text-gray-700'> 
                No bookings found.
              </span>
            </div>
          ) : (
            <BookingsTable 
              viewColumns={bookingsListColumns} 
              paginationState={paginationState}
              bookings={bookingList}
            />
          )
        }
    </div>
  )
}

export default CBDesktopBody;