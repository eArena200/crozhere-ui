'use client';

import React from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  selectBookingState,
  selectClubStations,
  selectSelectedStationType,
  selectTimeBasedSelectionState,
  setTimeBasedState,
} from '@/redux/slices/booking/bookingSlice';
import { checkAvailByTimeApi, CheckAvailByTimeRequest, StationAvailability } from '@/api/clubAvailabilityApi';
import { StationType } from '@/lib/types/station';
import BookingStation from '../BookingStation';
import { localToUTCISOString, utcToLocalISOString } from '@/lib/date-time-util';

function TimeBasedSelection() {
  const dispatchRedux = useDispatchRedux();
  const selectedStationType  = useSelector(selectSelectedStationType)
  const timeBasedSelectionState = useSelector(selectTimeBasedSelectionState);
  const clubSupportedStations = useSelector(selectClubStations);
  const { clubId } = useSelector(selectBookingState);

  const handleInputChange = (partialUpdate: Partial<typeof timeBasedSelectionState>) => {
    if (!timeBasedSelectionState) return;
    dispatchRedux(setTimeBasedState({
      ...timeBasedSelectionState,
      ...partialUpdate,
      availableStations: {},
      selectedStations: {},
    }));
  };

  const handleSelection = (partialUpdate: Partial<typeof timeBasedSelectionState>) => {
    if (!timeBasedSelectionState) return;
    dispatchRedux(setTimeBasedState({
      ...timeBasedSelectionState,
      ...partialUpdate,
    }));
  };

  const toggleStation = (stationId: number) => {
    const selectedStations = { ...timeBasedSelectionState.selectedStations };
    if (selectedStations[stationId]) {
      delete selectedStations[stationId];
    } else {
      selectedStations[stationId] = { stationId, playerCount: 1 };
    }
    handleSelection({ selectedStations });
  };

  const updatePlayerCount = (stationId: number, count: number) => {
    const selectedStations = { ...timeBasedSelectionState.selectedStations };
    if (selectedStations[stationId]) {
      selectedStations[stationId] = { ...selectedStations[stationId], playerCount: count };
      handleSelection({ selectedStations });
    }
  };

  const handleCheckAvailability = async () => {
    if (!selectedStationType || !timeBasedSelectionState || !clubId) return;

    const { startTime, endTime } = timeBasedSelectionState;
    if (!startTime || !endTime) {
      alert('Please select both start and end time.');
      return;
    }

    try {
      const request: CheckAvailByTimeRequest = {
        clubId,
        stationType: selectedStationType,
        startTime,
        endTime,
      };
      const response = await checkAvailByTimeApi(request);
      const stationAvailRecord: Record<number, StationAvailability> = Object.fromEntries(
        response.stationsAvailability.map(s => [s.stationId, s])
      );
      dispatchRedux(
        setTimeBasedState({
          ...timeBasedSelectionState,
          availableStations: stationAvailRecord,
          selectedStations: {},
        })
      );
    } catch (error) {
      console.error('Failed to fetch time-based availability:', error);
      alert('Unable to check availability for the selected time.');
    }
  };

  if (!timeBasedSelectionState) return null;

  const selectedStationIds = Object.keys(timeBasedSelectionState.selectedStations).map(Number);

  return (
    <div className="mt-4 space-y-2 text-sm text-gray-800">
      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            step={1800}
            value={utcToLocalISOString(timeBasedSelectionState.startTime).slice(0, 16)}
            onChange={(e) => handleInputChange({ startTime: localToUTCISOString(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            step={1800}
            value={utcToLocalISOString(timeBasedSelectionState.endTime).slice(0, 16)}
            onChange={(e) => handleInputChange({ endTime: localToUTCISOString(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheckAvailability}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Check Availability
      </button>

      {/* Stations Grid */}
      {Object.keys(timeBasedSelectionState.availableStations).length > 0 && (
        <div className="mt-4 rounded-md p-2">
          <h3 className="text-md font-semibold mb-2">Available Stations</h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(timeBasedSelectionState.availableStations).map((s) => (
              <BookingStation
                key={s.stationId}
                stationId={s.stationId}
                stationName={clubSupportedStations[s.stationId].stationName}
                stationType={clubSupportedStations[s.stationId].stationType}
                isAvailable={s.available}
                capacity={clubSupportedStations[s.stationId].capacity}
                isSelected={!!timeBasedSelectionState.selectedStations[s.stationId]}
                playerCount={timeBasedSelectionState.selectedStations[s.stationId]?.playerCount ?? 1}
                onToggle={toggleStation}
                onPlayerCountChange={updatePlayerCount}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeBasedSelection;
