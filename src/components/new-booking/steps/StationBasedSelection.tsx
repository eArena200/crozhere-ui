'use client';

import React from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  selectBookingState,
  selectStationBasedSelectionState,
  setStationBasedState,
} from '@/redux/slices/booking/bookingSlice';
import {
  CheckAvailByStationRequest,
  checkAvailByStationsApi,
} from '@/api/club/clubAvailabilityApi';
import { StationType } from '@/lib/types/station';
import BookingStation from '@/components/new-booking/BookingStation';
import { localToUTCISOString, toReadableDateTime, utcToLocalISOString } from '@/lib/date-time-util';

function StationBasedSelection() {
  const dispatchRedux = useDispatchRedux();
  const { clubId } = useSelector(selectBookingState);
  const stationBasedState = useSelector(selectStationBasedSelectionState);

  if (!stationBasedState) return null;

  const selectedStationsRecord = stationBasedState.selectedStations;
  const selectedStationIds = Object.keys(selectedStationsRecord).map(Number);
  const stationOptionsArray = Object.values(stationBasedState.stationOptions);

  const handleInputChange = (partialUpdate: Partial<typeof stationBasedState>) => {
    dispatchRedux(setStationBasedState({
      ...stationBasedState,
      ...partialUpdate,
      availableSlots: [],
      selectedSlot: null,
    }));
  };

  const handleSelection = (partialUpdate: Partial<typeof stationBasedState>) => {
    dispatchRedux(setStationBasedState({
      ...stationBasedState,
      ...partialUpdate,
    }));
  };

  const toggleStation = (stationId: number) => {
    const newSelectedStations = { ...selectedStationsRecord };
    if (stationId in newSelectedStations) {
      delete newSelectedStations[stationId];
    } else {
      newSelectedStations[stationId] = { stationId, playerCount: 1 };
    }
    handleInputChange({ selectedStations: newSelectedStations });
  };

  const updatePlayerCount = (stationId: number, count: number) => {
    if (!(stationId in selectedStationsRecord)) return;
    const newSelectedStations = {
      ...selectedStationsRecord,
      [stationId]: { ...selectedStationsRecord[stationId], playerCount: count },
    };
    handleInputChange({ selectedStations: newSelectedStations });
  };

  const handleCheckAvailability = async () => {
    if (
      !clubId ||
      !stationBasedState ||
      Object.keys(selectedStationsRecord).length === 0 ||
      !stationBasedState.searchWindow.windowStartTime ||
      !stationBasedState.searchWindow.windowHours
    ) {
      alert('Please select stations and search window');
      return;
    }

    try {
      const request: CheckAvailByStationRequest = {
        clubId,
        stationType: StationType.PC,
        stations: Object.values(selectedStationsRecord),
        durationHrs: stationBasedState.bookingDuration,
        searchWindow: {
          dateTime: stationBasedState.searchWindow.windowStartTime,
          windowHrs: stationBasedState.searchWindow.windowHours,
        },
      };

      const response = await checkAvailByStationsApi(request);

      dispatchRedux(
        setStationBasedState({
          ...stationBasedState,
          availableSlots: response.availableTimes,
          selectedSlot: null,
        })
      );
    } catch (error) {
      console.error('Availability check failed', error);
      alert('Failed to fetch availability slots.');
    }
  };

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {/* Stations */}
      <div>
        <label className="font-semibold text-gray-700 mb-2 block">Select Stations</label>
        <div className="grid grid-cols-5 gap-3">
          {stationOptionsArray.map((station) => {
            const isSelected = station.stationId in selectedStationsRecord;
            const playerCount = isSelected ? selectedStationsRecord[station.stationId].playerCount : 1;

            return (
              <BookingStation
                key={station.stationId}
                stationId={station.stationId}
                stationName={station.stationName}
                stationType={station.stationType}
                isAvailable={true}
                capacity={station.capacity}
                isSelected={isSelected}
                playerCount={playerCount}
                onToggle={toggleStation}
                onPlayerCountChange={updatePlayerCount}
              />
            );
          })}
        </div>
      </div>

      {/* Booking Duration */}
      <div>
        <label className="font-semibold block mb-1">Booking Duration (hours)</label>
        <input
          type="number"
          min={1}
          step={0.5}
          value={stationBasedState.bookingDuration}
          onChange={(e) => handleInputChange({ bookingDuration: Number(e.target.value) })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Window */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Search From Time</label>
          <input
            type="datetime-local"
            value={utcToLocalISOString(stationBasedState.searchWindow.windowStartTime).slice(0, 16)}
            onChange={(e) =>
              handleInputChange({
                searchWindow: {
                  ...stationBasedState.searchWindow,
                  windowStartTime: localToUTCISOString(e.target.value),
                },
              })
            }
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Search Window (hours)</label>
          <input
            type="number"
            min={3}
            step={3}
            max={24}
            value={stationBasedState.searchWindow.windowHours}
            onChange={(e) =>
              handleInputChange({
                searchWindow: {
                  ...stationBasedState.searchWindow,
                  windowHours: Number(e.target.value),
                },
              })
            }
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

      {/* Available Slots */}
      {stationBasedState.availableSlots.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stationBasedState.availableSlots.map((slot) => (
              <div
                key={slot}
                onClick={() => handleSelection({ selectedSlot: slot })}
                className={`p-3 border rounded-lg cursor-pointer text-center transition
                  ${stationBasedState.selectedSlot === slot ? 'bg-blue-100 border-blue-600' : 'hover:bg-gray-50'}`}
              >
                {`${toReadableDateTime(slot)} — ${toReadableDateTime(getEndTimeForSlot(slot, stationBasedState.bookingDuration))}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getEndTimeForSlot(startTime: string, durationHrs: number): string {
  const start = new Date(startTime);
  const durationMs = durationHrs * 60 * 60 * 1000;
  const end = new Date(start.getTime() + durationMs);
  return end.toISOString();
}

export default StationBasedSelection;
