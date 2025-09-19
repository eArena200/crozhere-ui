'use client';

import React, { useState } from "react";
import { Columns3, ListFilter, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { 
    selectSelectedClubBookingsState
} from "@/redux/slices/club/booking/clubBookingsListSlice";
import Button from "@/components/ui/Button";
import FilterPanel from "@/components/club-bookings/desktop/FilterPanel";
import ManageColumnPanel from "@/components/club-bookings/desktop/ManageColumnPanel";

enum DataPanelType {
    FILTER,
    COLUMNS
}

interface DataPanelState {
    isOpen: boolean;
    type: DataPanelType | null;
}

function BookingsActionBar() {
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
        <div className="w-full min-h-14 rounded-lg items-center text-black p-2">
            {/* Control panel */}
            <div className="flex flex-row gap-2 justify-start items-center w-full">
                <div className="flex flex-row items-center justify-between border rounded-md h-10 w-2xl">
                    <input
                        type="text"
                        placeholder="Search Bookings"
                        className="w-full h-full"
                    />
                    <Search className="mx-2"/>
                </div>
                <Button 
                    variant="primary"
                    className="h-10 w-30"
                >
                    <span>Search</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => togglePanel(DataPanelType.FILTER)}
                    className="flex flex-row gap-1 items-center justify-center h-10 w-30"
                >
                    <ListFilter className="h-4 w-4" />
                    <span>Filters</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => togglePanel(DataPanelType.COLUMNS)}
                    className="flex flex-row gap-1 items-center justify-center h-10 w-40"
                >
                    <Columns3 className="h-4 w-4" />
                    <span>Manage View</span>
                </Button>
            </div>

            {/* Data panel */}
            {
                dataPanelState.isOpen && (
                    dataPanelState.type === DataPanelType.FILTER ? (
                        <FilterPanel
                            filters={filterState}
                            supportedStationTypes={supportedStationTypes}
                            onClose={() => {
                                setDataPanelState({isOpen:false, type:null})
                            }}
                        />
                    ) : (
                        <ManageColumnPanel 
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

export default BookingsActionBar;
