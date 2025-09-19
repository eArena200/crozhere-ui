'use client';

import React, { useEffect, useState } from 'react';
import { BookingDetailsResponse } from '@/api/booking/model';
import { Clock, Info, User } from 'lucide-react';
import CountdownTimer from '@/components/dashboard/CountdownTimer';
import { StationDetailsResponse } from '@/api/club/model';

export enum StationAvailableStatus {
  AVAILABLE,
  BOOKED,
  INACTIVE
}

export interface StationStatusCardMobileProps {
  stationDetails: StationDetailsResponse;
  currentBooking: BookingDetailsResponse | null;
  nextBooking: BookingDetailsResponse | null;
}

export default function StationStatusCardMobile({
  stationDetails,
  currentBooking,
  nextBooking,
}: StationStatusCardMobileProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!currentBooking?.booking.startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(currentBooking.booking.endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Ended');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        setTimeRemaining(`${hours}h ${mins}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBooking?.booking.endTime]);

  const statusColor = {
    [StationAvailableStatus.AVAILABLE]: 'bg-green-500',
    [StationAvailableStatus.BOOKED]: 'bg-red-400',
    [StationAvailableStatus.INACTIVE]: 'bg-gray-500',
  }[getStationStatus(stationDetails.isActive, currentBooking)];

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded shadow-md border-1 border-gray-400 text-sm overflow-hidden min-h-40 w-full flex flex-1 p-1 space-x-1">
      {/* Status bar and name */}
      <div className={`flex w-1/6 rounded-sm h-full text-white items-center justify-center font-semibold ${statusColor}`}>
          {stationDetails.stationName}
      </div>
      <div className='flex w-5/6 h-full'>
       { 
        stationDetails.isActive ? ( 
            <div className="w-full flex flex-col space-y-1 text-gray-700">
              {/* Current Booking */}
              <div className='h-full border rounded bg-gray-100 border-gray-300'>
                {currentBooking ? (
                  <div className='h-full flex flex-row items-start justify-between gap-2'>
                    <div className='w-2/3 text-gray-700 font-semibold text-md px-2 py-1'>
                      <div className='text-gray-700 font-semibold text-md'> 
                        Current 
                      </div>
                      <div className='flex items-center text-gray-700 font-normal text-xs gap-0.5 mt-0.5'> 
                        {<Clock size={16}/>}
                        {`${formatTime(currentBooking?.booking.startTime)}`}
                        {' - '}
                        {`${formatTime(currentBooking?.booking.endTime)}`}
                      </div>
                      <div className='flex items-center text-gray-700 font-normal text-xs gap-0.5 mt-0.5'> 
                        {<User size={16}/>}
                        {`${(currentBooking?.player.playerPhoneNumber)}`}
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full text-xs text-black border-l border-gray-400 items-center justify-center">
                      <span>ENDS IN</span>
                      <CountdownTimer endTime={currentBooking.booking.endTime}/>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex flex-col text-gray-700 justify-center items-center gap-1"
                  >
                    <Info size={20} className='text-gray-700' />
                    <div>
                      No current booking
                    </div>
                  </div>
                )}
              </div>
              {/* Next Booking */}
              <div className='h-full border rounded bg-gray-100 border-gray-300'>
                {nextBooking ? (
                  <div className='h-full flex flex-row items-start justify-between gap-2'>
                    <div className='w-2/3 text-gray-700 font-semibold text-md px-2 py-1'>
                      <div className='text-gray-700 font-semibold text-md'> 
                        Upcoming 
                      </div>
                      <div className='flex items-center text-gray-700 font-normal text-xs gap-0.5 mt-0.5'> 
                        {<Clock size={16}/>}
                        {`${formatTime(nextBooking?.booking.startTime)}`}
                        {' - '}
                        {`${formatTime(nextBooking?.booking.endTime)}`}
                      </div>
                      <div className='flex items-center text-gray-700 font-normal text-xs gap-0.5 mt-0.5'> 
                        {<User size={16}/>}
                        {`${(nextBooking?.player.playerPhoneNumber)}`}
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full text-xs text-black border-l border-gray-400 items-center justify-center">
                      <span>STARTS IN</span>
                      <CountdownTimer endTime={nextBooking.booking.startTime}/>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex flex-col text-gray-700 justify-center items-center gap-1"
                  >
                    <Info size={20} className='text-gray-700' />
                    <div>
                      No upcoming booking
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-200 gap-2'> 
              <Info size={25}/>
              {`STATION UNAVAILABLE`}
            </div>
          )
        }
      </div>
    </div>
  );
}

function getStationStatus(
  isActive: boolean, 
  currentBooking: BookingDetailsResponse | null){
  if(isActive){
    return (currentBooking !== null) ? StationAvailableStatus.BOOKED : StationAvailableStatus.AVAILABLE;
  } else {
    return StationAvailableStatus.INACTIVE;
  }
}
