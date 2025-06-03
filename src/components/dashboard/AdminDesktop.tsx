import React from 'react';
import ClubLayout from '../club/ClubLayout';
import UpcomingBookings from './UpcomingBookings';

export default function AdminDesktop() {
  return (
    <>
      <div className="flex bg-white h-full w-full px-2 py-4 gap-2">
          <div className="w-4/5 h-[90vh]" >
              <ClubLayout />
          </div>
          <div className="w-1/5 h-[90vh]">
              <UpcomingBookings />
          </div>
      </div>
    </>
  );
}
