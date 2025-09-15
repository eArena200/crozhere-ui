import React from 'react'
import StationsStatusContent from '@/components/dashboard/desktop/activity/StationsStatusContent'
import UpcomingBookings from '@/components/dashboard/desktop/upcoming/UpcomingBookings'
import { useSelector } from 'react-redux'
import { selectClubDashboardState } from '@/redux/slices/club/dashboard/clubDashboardSlice'
import { Info } from 'lucide-react'

function ClubDashboardDesktopBody() {
  const { selectedClubId } = useSelector(selectClubDashboardState);
  return (
    selectedClubId ? (
      <div className='w-full min-h-[85vh] flex flex-1 bg-white text-black'>
        <div className="w-4/5 h-[80vh] px-1">
          <StationsStatusContent />
        </div>
        <div className="w-1/5 h-[80vh] px-1">
          <UpcomingBookings clubId={selectedClubId} />
        </div>
      </div>
    ) : (
      <div className='w-full h-full min-h-[85vh] bg-gray-200 flex flex-1 items-center justify-center gap-2'>
        <Info size={40} className='text-gray-800'/>
        <span className='text-2xl font-semibold text-gray-800'>
          Select a club to view Dashboard
        </span>
      </div>
    )
  )
}

export default ClubDashboardDesktopBody