import React, { useEffect, useState } from 'react';
import { BookingsFilters, BookingStatus, BookingType } from '@/lib/types/bookings';
import { StationType } from '@/lib/types/station';

interface MobileFilterSectionProps {
  filters: BookingsFilters;
  onChange: (updatedFilters: Partial<BookingsFilters>) => void;
  supportedStationTypes: StationType[];
}

const BOOKING_STATUSES: { label: string; value: BookingStatus }[] = [
  { label: 'Confirmed', value: BookingStatus.CONFIRMED },
  { label: 'Cancelled', value: BookingStatus.CANCELLED },
];

const BOOKING_TYPES: { label: string; value: BookingType }[] = [
  { label: 'Individual', value: BookingType.IND },
  { label: 'Group', value: BookingType.GRP },
];

function MobileFilterSection({ filters, onChange, supportedStationTypes }: MobileFilterSectionProps) {
  const [localFilters, setLocalFilters] = useState<BookingsFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleArrayValue = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const handleStationTypeChange = (type: StationType) => {
    setLocalFilters(prev => ({
      ...prev,
      stationTypes: toggleArrayValue(prev.stationTypes, type),
    }));
  };

  const handleBookingStatusChange = (status: BookingStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      bookingStatuses: toggleArrayValue(prev.bookingStatuses, status),
    }));
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setLocalFilters(prev => ({
      ...prev,
      bookingTypes: toggleArrayValue(prev.bookingTypes, type),
    }));
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: BookingsFilters = {
      fromDateTime: '',
      toDateTime: '',
      stationTypes: [],
      bookingStatuses: [],
      bookingTypes: [],
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-black w-64 bg-white border rounded shadow-sm">
      <div>
        <label htmlFor="fromDateTime" className="block text-sm font-medium mb-1">From Date & Time</label>
        <input
          id="fromDateTime"
          type="datetime-local"
          name="fromDateTime"
          value={localFilters.fromDateTime}
          onChange={handleInputChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label htmlFor="toDateTime" className="block text-sm font-medium mb-1">To Date & Time</label>
        <input
          id="toDateTime"
          type="datetime-local"
          name="toDateTime"
          value={localFilters.toDateTime}
          onChange={handleInputChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Station Types</p>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {supportedStationTypes.map(type => (
            <label key={type} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.stationTypes.includes(type)}
                onChange={() => handleStationTypeChange(type)}
                className="accent-blue-600"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Booking Status</p>
        <div className="flex flex-col gap-2">
          {BOOKING_STATUSES.map(({ label, value }) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.bookingStatuses.includes(value)}
                onChange={() => handleBookingStatusChange(value)}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Booking Type</p>
        <div className="flex flex-col gap-2">
          {BOOKING_TYPES.map(({ label, value }) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.bookingTypes.includes(value)}
                onChange={() => handleBookingTypeChange(value)}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default MobileFilterSection;
