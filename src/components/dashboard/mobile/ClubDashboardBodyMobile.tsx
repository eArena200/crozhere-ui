'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import UpcomingBookingsMobile from '@/components/dashboard/mobile/upcoming/UpcomingBookingsMobile';
import StationsStatusContentMobile from '@/components/dashboard/mobile/activity/StationsStatusContentMobile';

enum ActiveTab {
  ACTIVITY,
  UPCOMING
}

interface ClubDashboardBodyMobileProps {
  clubId: number;
}

function ClubDashboardBodyMobile({ clubId }: ClubDashboardBodyMobileProps) {
  const [activeSection, setActiveSection] = useState<ActiveTab>(ActiveTab.ACTIVITY);
  return (
    <div className='min-h-screen w-full mt-12'>
      <div className='fixed bg-white top-16 left-0 z-50 text-black w-full h-12 
        flex flex-row items-center justify-around shadow-md border-b border-gray-400'>
        <button
          className={cn(
          'text-center text-md font-mono w-full h-12 rounded-t-md',
          activeSection === ActiveTab.ACTIVITY
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-200 text-gray-700'
          )}
          onClick={() => setActiveSection(ActiveTab.ACTIVITY)}
        >
          Activity
        </button>
        <button
          className={cn(
          'text-center text-md font-mono w-full h-12 rounded-t-md',
          activeSection === ActiveTab.UPCOMING
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-200 text-gray-700'
          )}
          onClick={() => setActiveSection(ActiveTab.UPCOMING)}
        >
          Upcoming Bookings
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {
          activeSection === ActiveTab.ACTIVITY && 
          <StationsStatusContentMobile />
        }
        {
          activeSection === ActiveTab.UPCOMING && 
          <UpcomingBookingsMobile clubId={clubId} />
        }
      </div>
    </div>
  );
}

export default ClubDashboardBodyMobile;