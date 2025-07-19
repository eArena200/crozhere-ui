import React, { useEffect } from 'react';
import BookingListItem from './UpcomingBookingListItem';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUpcomingBookings, selectUpcomingBookingsMap } from '@/redux/slices/club/dashboard/clubDashboardSlice';


export default function UpcomingBookings({clubId}:{clubId: number}) {
  const dispatchRedux = useDispatchRedux();
  const upcomingBookings = useSelector(selectUpcomingBookingsMap);
  
  useEffect(() => {
    if(clubId){
      dispatchRedux(fetchUpcomingBookings({clubId}));
    }
  }, [dispatchRedux, clubId]);

  return (
    <div className="bg-white border-2 border-gray-300 rounded shadow h-full w-full flex flex-col">

      <div className="bg-blue-600 rounded-t p-2 flex items-center justify-center">
        <h2 className="text-md font-bold text-white">Upcoming Bookings</h2>
      </div>

      <div className="bg-white overflow-y-auto flex-1 space-y-2 p-2">
        {Object.entries(upcomingBookings).map(([bookingId, booking]) => (
          <BookingListItem
            key={bookingId}
            playerName={booking.player.name}
            contact={booking.player.playerPhoneNumber}
            startTime={booking.booking.startTime}
            endTime={booking.booking.endTime}
            stationType={booking.booking.stationType}
            players={booking.booking.totalPlayers}
          />
        ))}
      </div>
    </div>
  );
}
