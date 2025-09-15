'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { StationType } from '@/lib/types/station';
import TimeBasedSelection from '@/components/club-booking/steps/TimeBasedSelection';
import StationBasedSelection from '@/components/club-booking/steps/StationBasedSelection';
import {
  setBookingMode,
  setSelectedStationType,
  selectSupportedStationTypes,
  setStationBasedState,
  selectClubStations,
  setTimeBasedState,
  selectSelectionState,
  selectActiveIntents,
  setActiveIntentAndProceedToPayment,
  cancelBookingIntent,
  setBookingPlayerState,
  selectBookingPlayerState
} from '@/redux/slices/booking/bookingSlice';
import { useDispatchRedux } from '@/redux/store';
import ActiveIntentCard from '@/components/club-booking/ActiveIntentCard';
import { BookingSelectionMode } from '@/redux/slices/booking/state';
import { selectAuthState } from '@/redux/slices/auth/authSlice';
import { DeviceTypes, useDeviceType } from '@/lib/hooks/useDeviceType';

export default function SelectTimeOrStationStep() {
  const dispatchRedux = useDispatchRedux();
  const deviceType = useDeviceType();
  const authState = useSelector(selectAuthState);
  const userRole = authState.user.role;

  const bookingPlayerState = useSelector(selectBookingPlayerState);
  const supportedStationTypes = useSelector(selectSupportedStationTypes);
  const clubStationsRecord = useSelector(selectClubStations);
  const activeIntentsRecord = useSelector(selectActiveIntents);

  const activeIntentsArray = Object.values(activeIntentsRecord);

  const {
    mode,
    selectedStationType,
    timeBased,
    stationBased
  } = useSelector(selectSelectionState);

  const handleChangeStationType = (value: StationType) => {
    const stationOptionsRecord = Object.fromEntries(
      Object.entries(clubStationsRecord)
        .filter(([_, station]) => station.stationType === value)
    );

    dispatchRedux(setSelectedStationType(value));

    dispatchRedux(setStationBasedState({
      ...stationBased,
      stationOptions: stationOptionsRecord,
      selectedStations: {},
      availableSlots: [],
      selectedSlot: null,
    }));

    dispatchRedux(setTimeBasedState({
      ...timeBased,
      selectedStations: {},
      availableStations: {},
    }));
  };

  const handleChangeMode = (mode: BookingSelectionMode) => {
    dispatchRedux(setBookingMode(mode));
  };

  return (
    deviceType.type === DeviceTypes.MOBILE ? (
      <div className='flex flex-col w-full'>
        {/* Resume Booking */}
        {activeIntentsArray.length > 0 && (
          <div className='mb-4'>
            <span className='text-gray-600 text-md mb-2 font-semibold'>Resume Booking</span>
            <div className='p-2 border-2 border-gray-400 max-h-[200px] rounded-lg overflow-y-auto'>
              {activeIntentsArray.map((intent) => (
                <div key={intent.intentId} className='mb-2'> 
                  <ActiveIntentCard 
                    intent={intent} 
                    onClick={() => {
                      dispatchRedux(setActiveIntentAndProceedToPayment(intent));
                    }}
                    onCancel={() => {
                      dispatchRedux(cancelBookingIntent({
                        clubId: intent.club.clubId,
                        intentId: intent.intentId
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Booking */}
        <div className={`w-full space-y-2 text-black`}>
          {/* 1. Select Station Type */}
          <div className="flex flex-col w-full space-y-1">
            {userRole === 'CLUB_ADMIN' && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingPlayerState.playerPhoneNumber ?? ''}
                  onChange={(e) =>
                    dispatchRedux(
                      setBookingPlayerState({ playerPhoneNumber: e.target.value })
                    )
                  }
                  placeholder="Enter player's phone number"
                  className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station-Type
              </label>
              <select
                value={selectedStationType ?? ''}
                onChange={(e) => handleChangeStationType(e.target.value as StationType)}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Station</option>
                {supportedStationTypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Show Step Mode Options only if stationType is selected */}
          {selectedStationType && (
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded ${mode === BookingSelectionMode.TIME ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleChangeMode(BookingSelectionMode.TIME)}
                >
                  Select by Time
                </button>
                <button
                  className={`px-4 py-2 rounded ${mode === BookingSelectionMode.STATION ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleChangeMode(BookingSelectionMode.STATION)}
                >
                  Select by Station
                </button>
              </div>
            )
          }

          {/* 3. Main Body */}
          {selectedStationType && (
            mode === BookingSelectionMode.TIME
              ? <TimeBasedSelection />
              : <StationBasedSelection />
          )}
        </div>
      </div>
    ) :(
      // DESKTOP VIEW
      <div className='flex w-full'>
        {/* Resume Booking */}
        {activeIntentsArray.length > 0 &&  (
          <div className='w-1/2 mr-2 border-r-2 border-gray-400 pr-3 max-h-[500px] overflow-y-auto'>
              {activeIntentsArray.map((intent) => (
                <div key={intent.intentId} className='mb-2'> 
                  <ActiveIntentCard 
                    intent={intent} 
                    onClick={() => {
                      dispatchRedux(setActiveIntentAndProceedToPayment(intent));
                    }}
                    onCancel={() => {
                      dispatchRedux(cancelBookingIntent({
                        clubId: intent.club.clubId,
                        intentId: intent.intentId
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        {/* New Booking */}
        <div className={`${activeIntentsArray.length > 0 ? 'w-1/2' : 'w-full'} space-y-2 text-black`}>
          {/* 1. Select Station Type */}
          <div className="flex flex-col w-full space-y-1">
            {userRole === 'CLUB_ADMIN' && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingPlayerState.playerPhoneNumber ?? ''}
                  onChange={(e) =>
                    dispatchRedux(
                      setBookingPlayerState({ playerPhoneNumber: e.target.value })
                    )
                  }
                  placeholder="Enter player's phone number"
                  className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station-Type
              </label>
              <select
                value={selectedStationType ?? ''}
                onChange={(e) => handleChangeStationType(e.target.value as StationType)}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Station</option>
                {supportedStationTypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Show Step Mode Options only if stationType is selected */}
          {selectedStationType && (
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded ${mode === BookingSelectionMode.TIME ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleChangeMode(BookingSelectionMode.TIME)}
                >
                  Select by Time
                </button>
                <button
                  className={`px-4 py-2 rounded ${mode === BookingSelectionMode.STATION ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleChangeMode(BookingSelectionMode.STATION)}
                >
                  Select by Station
                </button>
              </div>
            )
          }

          {/* 3. Main Body */}
          {selectedStationType && (
            mode === BookingSelectionMode.TIME
              ? <TimeBasedSelection />
              : <StationBasedSelection />
          )}
        </div>
      </div>
    )
  );
}
