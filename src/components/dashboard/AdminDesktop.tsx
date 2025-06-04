import React from 'react';
import ClubLayout from '../club/ClubLayout';
import UpcomingBookings from './UpcomingBookings';
import ClubDashboard from './ClubDashboard';
import TestClubApi from './TestClubApi';

export default function AdminDesktop() {
  const clubName = "Lord Of Gaming";

  return (
    <>
      <div className="flex w-full bg-white items-start px-2 text-2xl pt-4 text-gray-700 font-bold">
        {clubName}
      </div>
      <div className="flex bg-white h-full w-full px-2 py-3 gap-2">
          <div className="w-4/5 h-[80vh]" >
              {/* <ClubLayout />   */}
              <ClubDashboard />
          </div>
          <div className="w-1/5 h-[80vh]">
              <UpcomingBookings />
          </div>
          <TestClubApi/>
      </div> 
    </>
  );
}
