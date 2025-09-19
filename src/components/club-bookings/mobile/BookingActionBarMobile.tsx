'use client';

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
    selectSelectedClubBookingsState
} from "@/redux/slices/club/booking/clubBookingsListSlice";
import Button from "@/components/ui/Button";
import { Columns3, Filter } from "lucide-react";
import FilterPanelMobile from "@/components/club-bookings/mobile/FilterPanelMobile";
import ManageColumnPanelMobile from "@/components/club-bookings/mobile/ManageColumnPanelMobile";

enum DataPanelType {
    FILTER,
    COLUMNS
}

interface DataPanelState {
    isOpen: boolean;
    type: DataPanelType | null;
}

function BookingsActionBarMobile() {
    const { 
        filterState,
        supportedStationTypes,
        bookingsListColumns
    } = useSelector(selectSelectedClubBookingsState);

    const [dataPanelState, setDataPanelState] = useState<DataPanelState>({
        isOpen: false,
        type: null
    });

    const togglePanel = (type: DataPanelType) => {
        setDataPanelState((prev) => ({
            isOpen: prev.type === type ? !prev.isOpen : true,
            type,
        }));
    };

    return (
        <div className="flex flex-col w-full min-h-14 rounded-lg items-end text-black p-1">
            {/* Control panel */}
            <div className="flex flex-row gap-2 justify-start items-center w-full">
                <div className="flex flex-row items-center justify-between border rounded-md h-10 w-sm">
                    <input
                        type="text"
                        placeholder="Search Bookings"
                        className="w-full h-full text-sm p-1"
                    />
                </div>
                <Button 
                    variant="primary"
                    className="h-10 w-30 text-sm"
                >
                    <span>Search</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => togglePanel(DataPanelType.FILTER)}
                    className="flex flex-row gap-1 items-center justify-center h-10 p-1"
                >
                    <Filter className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => togglePanel(DataPanelType.COLUMNS)}
                    className="flex flex-row gap-1 items-center justify-center h-10 p-1"
                >
                    <Columns3 className="h-4 w-4" />
                </Button>
            </div>

            {/* Data panel */}
            {
                dataPanelState.isOpen && (
                    dataPanelState.type === DataPanelType.FILTER ? (
                        <FilterPanelMobile
                            filters={filterState}
                            supportedStationTypes={supportedStationTypes}
                            onClose={() => {
                                setDataPanelState({isOpen:false, type:null})
                            }}
                        />
                    ) : (
                        <ManageColumnPanelMobile
                            viewColumns={bookingsListColumns}
                            onClose={() => {
                                setDataPanelState({isOpen:false, type:null})
                            }}
                        />
                    )
                )
            }
        </div>
    );
}

export default BookingsActionBarMobile;
