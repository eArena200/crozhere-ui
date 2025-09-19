import { BookingDetailsResponse } from "@/api/booking/model";
import { ClubResponse } from "@/api/club/model";
import { 
    BookingsColumn,
    BookingsFilters, 
    BookingsPagination, 
    BookingsSearch, 
    BookingsSort 
} from "@/lib/types/bookings";
import { StationType } from "@/lib/types/station";

export interface ClubBookingsState {
    clubList: ClubResponse[];
    clubListLoading: boolean;
    clubListError?: string;

    selectedClubId?: number;
    selectedClubBookingsState: {
        supportedStationTypes: StationType[];
        supportedStationTypesLoading:boolean;
        supportedStationTypesError?: string;
        searchState: BookingsSearch;
        paginationState: BookingsPagination;
        filterState: BookingsFilters;
        sortState: BookingsSort;
        bookingList: BookingDetailsResponse[];
        bookingListLoading: boolean;
        bookingListError?: string;

        bookingsListColumns: BookingsColumn[];
    }
}