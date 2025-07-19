import { BookingDetailsResponse, DashboardStationBookingStatus } from "@/api/booking/model";
import { ClubDetailsResponse, ClubResponse, StationDetailsResponse } from "@/api/clubManagementApi";
import { Station, StationType } from "@/lib/types/station";

export interface ClubDashboardState {
    selectedClubId?: number;
    clubs: Record<number, ClubResponse>;
    clubsLoading: boolean;
    clubsError?: string;

    selectedClubDetails?: ClubDetailsResponse;
    selectedClubDetailsLoading: boolean;
    selectedClubDetailsError?: string;
    
    clubSupportedStations: Record<number, StationDetailsResponse>;
    clubSupportedStationsLoading: boolean;
    clubSupportedStationsError?: string;

    stationsStatus: DashBoardStationsState;
    upcomingBookings: DashboardUpcomingBookingsState;
}

export interface DashBoardStationsState {
    stationBookingState: Record<number, DashboardStationBookingStatus>;
    stationBookingLoading: boolean;
    stationBookingError?: string;
}

export interface DashboardUpcomingBookingsState {
    windowHours: number;
    filterStationType: StationType[];
    upcomingBookings: Record<number, BookingDetailsResponse>;
    upcomingBookingsLoading: boolean;
    upcomingBookingsError?: string;
}