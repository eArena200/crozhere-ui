'use client';

import React, { useState } from "react";
import { useDispatchRedux } from "@/redux/store";
import Button from "@/components/ui/Button";
import { BookingsColumn } from "@/lib/types/bookings";
import { setBookingsListViewColumns } from "@/redux/slices/club/booking/clubBookingsListSlice";


interface ManageColumnPanelMobileProps {
  viewColumns: BookingsColumn[];
  onClose: () => void;
}

function ManageColumnPanelMobile({viewColumns, onClose}: ManageColumnPanelMobileProps) {
    const dispatch = useDispatchRedux();
    const [selectedColumns, setSelectedColumns] = useState<BookingsColumn[]>(viewColumns);
    
    const COLUMN_GROUPS: {
        group: string;
        columns: { label: string; value: BookingsColumn }[];
    }[] = [
        {
        group: "Player",
        columns: [
            { label: "Player Id", value: BookingsColumn.PLAYER_ID },
            { label: "Player Name", value: BookingsColumn.PLAYER_NAME },
            { label: "Phone Number", value: BookingsColumn.PLAYER_PHONE_NUMBER },
        ],
        },
        {
        group: "Station",
        columns: [
            { label: "Stations", value: BookingsColumn.STATIONS },
            { label: "Station Type", value: BookingsColumn.STATION_TYPE },
        ],
        },
        {
        group: "Booking",
        columns: [
            { label: "Start Time", value: BookingsColumn.START_TIME },
            { label: "End Time", value: BookingsColumn.END_TIME },
            { label: "Player Count", value: BookingsColumn.PLAYER_COUNT },
        ],
        },
        {
        group: "Amount",
        columns: [{ label: "Booking Amount", value: BookingsColumn.BOOKING_AMOUNT }],
        },
    ];
    
    const toggleColumn = (col: BookingsColumn) => {
        setSelectedColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
        );
    };
    
    const handleReset = () => {
        dispatch(setBookingsListViewColumns([
            BookingsColumn.PLAYER_ID,
            BookingsColumn.PLAYER_NAME,
            BookingsColumn.PLAYER_PHONE_NUMBER,
            BookingsColumn.STATION_TYPE,
            BookingsColumn.STATIONS,
            BookingsColumn.START_TIME,
            BookingsColumn.END_TIME,
            BookingsColumn.PLAYER_COUNT,
            BookingsColumn.BOOKING_AMOUNT,
        ]));
        onClose();
    };
    
    const handleApply = () => {
        dispatch(setBookingsListViewColumns(selectedColumns));
        onClose();
    };


    return (
        <div className="flex flex-col w-fit rounded-md border border-gray-300 bg-white shadow-md px-4 py-2 mt-2">
            <h3 className="text-sm font-semibold mb-3">Manage Columns</h3>
    
            <div className="flex flex-col gap-5">
                {COLUMN_GROUPS.map(({ group, columns }) => (
                    <div key={group} className="flex flex-col gap-1">
                        <p className="font-semibold text-xs text-gray-700">{group}</p>
                            {columns.map(({ label, value }) => (
                                <label key={value} className="inline-flex items-center gap-1 text-xs">
                                    <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(value)}
                                    onChange={() => toggleColumn(value)}
                                    className="accent-blue-600"
                                    />
                                    {label}
                                </label>
                            ))}
                    </div>
                ))}
            </div>
    
            <div className="flex flex-row justify-end items-center gap-1 mt-2">
                <Button variant="m_secondary" 
                    onClick={handleReset} 
                    className="h-10 w-25"
                >
                    Reset
                </Button>
                <Button 
                    variant="m_primary" 
                    onClick={handleApply} 
                    className="h-10 w-25"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}

export default ManageColumnPanelMobile;