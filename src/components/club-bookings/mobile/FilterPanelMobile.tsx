'use client';

import React, { useState } from "react";
import { useDispatchRedux } from "@/redux/store";
import Button from "@/components/ui/Button";
import { 
  BookingsFilters, 
  BookingStatus, 
  BookingType 
} from "@/lib/types/bookings";
import { StationType } from "@/lib/types/station";
import { 
  applyFilter, 
  resetFilter
} from "@/redux/slices/club/booking/clubBookingsListSlice";

interface FilterPanelMobileProps {
  filters: BookingsFilters;
  supportedStationTypes: StationType[];
  onClose: () => void
}

function FilterPanelMobile({filters, supportedStationTypes, onClose}: FilterPanelMobileProps) {
    const dispatch = useDispatchRedux();

    const [localFilters, setLocalFilters] = useState<BookingsFilters>(filters);

    const BOOKING_STATUSES: { label: string; value: BookingStatus }[] = [
        { label: 'Confirmed', value: BookingStatus.CONFIRMED },
        { label: 'Cancelled', value: BookingStatus.CANCELLED },
    ];
    
    const BOOKING_TYPES: { label: string; value: BookingType }[] = [
        { label: 'Individual', value: BookingType.IND },
        { label: 'Group', value: BookingType.GRP },
    ];

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
        dispatch(applyFilter(localFilters));
        onClose();
    };
    
    const handleReset = () => {
        dispatch(resetFilter());
        onClose();
    };

    return (
        <div className="flex flex-col items-start justify-start rounded-md border border-gray-300 shadow-md px-4 py-2 mt-2 w-fit">
            <h3 className="text-sm font-semibold mb-2">Filters</h3>
            <div className="w-full flex flex-col items-start justify-start gap-2 overflow-auto bg-white">
                {/* Date Filter Section */}
                <div className="flex flex-col items-center justify-start gap-2">
                    <div>
                        <label htmlFor="fromDateTime" className="block text-xs font-semibold">From</label>
                        <input
                            id="fromDateTime"
                            type="datetime-local"
                            name="fromDateTime"
                            value={localFilters.fromDateTime}
                            onChange={handleInputChange}
                            className="w-full min-w-40 border px-2 py-1 rounded text-xs"
                        />
                    </div>

                    <div>
                        <label htmlFor="toDateTime" className="block text-xs font-semibold">To</label>
                        <input
                            id="toDateTime"
                            type="datetime-local"
                            name="toDateTime"
                            value={localFilters.toDateTime}
                            onChange={handleInputChange}
                            className="w-full min-w-40 border px-2 py-1 rounded text-xs"
                        />
                    </div>
                </div>


                {/* StationTypes Section */}
                <div className="flex flex-col h-full items-start justify-start gap-2">
                    <p className="block text-xs font-semibold">Station Types</p>
                    <div className="flex flex-col gap-1 overflow-y-auto text-xs">
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

                { /* BookingStatus Section  */ }
                <div className="flex flex-col h-full items-start justify-start gap-2">
                    <p className="block text-xs font-semibold">Booking Status</p>
                    <div className="flex flex-col gap-1 overflow-y-auto text-xs">
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

                { /* BookingType Section  */ }
                <div className="flex flex-col h-full items-start justify-start gap-2">
                    <p className="block text-xs font-semibold">Booking Type</p>
                    <div className="flex flex-col gap-1 overflow-y-auto text-xs">
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
            </div>


            <div className="w-full flex flex-row items-end justify-end gap-2 mt-2">
                <Button 
                    variant="secondary"
                    className="h-10 w-25"
                    onClick={() => {
                        handleReset();
                    }}
                > 
                    Reset
                </Button>
                <Button 
                    variant="primary"
                    className="h-10 w-25"
                    onClick={() => {
                        handleApply();
                    }}
                > 
                    Apply
                </Button>
            </div>
        
        </div>
    );
}

export default FilterPanelMobile;
