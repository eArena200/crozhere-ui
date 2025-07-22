import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClubDashboardState } from "./state";
import { BookingDetailsResponse, DashboardStationBookingStatus } from "@/api/booking/model";
import { RootState } from "@/redux/store";
import { getDashboardStationStatusApi, getUpcomingBookingsForClubApi } from "@/api/booking/clubBookingApi";
import { StationType } from "@/lib/types/station";
import { ClubResponse } from "@/api/club-management/model";
import { ClubServiceException, ClubDetailsResponse, StationDetailsResponse } from "@/api/club/model";
import { getClubsForAdminApi } from "@/api/club-management/clubManagementApi";
import { getClubDetailsApi, getStationsInClubApi } from "@/api/club/clubDetailsApi";

const initialState: ClubDashboardState = {
    clubs: {},
    clubSupportedStations: {},
    clubsLoading: false,
    selectedClubDetailsLoading: false,
    clubSupportedStationsLoading: false,
    stationsStatus: {
        stationBookingState: {},
        stationBookingLoading: false
    },
    upcomingBookings: {
        windowHours: 0,
        filterStationType: [],
        upcomingBookings: {},
        upcomingBookingsLoading: false
    },
}


export const fetchClubsForAdminId = createAsyncThunk<
  ClubResponse[],
  void,
  { rejectValue: ClubServiceException }
>(
  "clubDashboard/fetchClubsForAdminId",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clubList = await getClubsForAdminApi();
      if (clubList.length > 0) {
        dispatch(setSelectedClubAndFetchDetails(clubList[0].clubId));
      }

      return clubList;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_DASHBOARD_THUNK_EXCEPTION",
        type: "FETCH_CLUBS_FOR_ADMIN_ID",
        message: "Failed to fetch clubs for adminId",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const setSelectedClubAndFetchDetails = createAsyncThunk<
  void,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubDashboard/setSelectedClubAndFetchDetails",
  async (clubId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSelectedClubId(clubId));
      await Promise.all([
        dispatch(fetchClubDetails(clubId)).unwrap(),
        dispatch(fetchStationsByClubId(clubId)).unwrap(),
        dispatch(fetchUpcomingBookings({clubId})).unwrap(),
        dispatch(fetchStationBookingStatus(clubId)).unwrap()
      ]);
    } catch (err: any) {
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }

      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "SET_SELECTED_CLUB_AND_FETCH_DETAILS",
        message: "Failed to fetch club details or stations",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const fetchClubDetails = createAsyncThunk<
  ClubDetailsResponse,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubDashboard/fetchClubDetailsById",
  async (clubId, { rejectWithValue }) => {
    try {
      const clubDetails = await getClubDetailsApi(clubId);
      return clubDetails;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_DASHBOARD_THUNK_EXCEPTION",
        type: "FETCH_CLUB_DETAILS_",
        message: "Failed to fetch club details",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const fetchStationsByClubId = createAsyncThunk<
  StationDetailsResponse[],
  number,
  { rejectValue: ClubServiceException }
>(
  "clubDashboard/fetchStationsByClubId",
  async (clubId, { rejectWithValue }) => {
    try {
      const stations = await getStationsInClubApi(clubId);
      return stations;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_DASHBOARD_THUNK_EXCEPTION",
        type: "FETCH_STATIONS_BY_CLUB_ID",
        message: "Failed to fetch stations",
        timestamp: new Date().toISOString()
      });
    }
  }
);


export const fetchStationBookingStatus = createAsyncThunk<
    Record<number, DashboardStationBookingStatus>,
    number,
    { 
        rejectValue: ClubServiceException 
    }
>(
    "clubDashboard/fetchStationBookingStatus",
    async (clubId, { rejectWithValue }) => {
        try {
            const response = getDashboardStationStatusApi(clubId);
            return response;
        } catch (err: any){
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_DASHBOARD_THUNK_EXCEPTION",
                type: "FETCH_STATIONS_BOOKING_STATUS",
                message: "Failed to fetch stations booking status",
                timestamp: new Date().toISOString()
            });
        }
    }
);

export const fetchUpcomingBookings = createAsyncThunk<
    BookingDetailsResponse[],
    {
      clubId: number;
      windowHrs?: number;
      stationTypes?: StationType[]
    },
    { 
      rejectValue: ClubServiceException 
    }
>(
    "clubDashboard/fetchUpcomingBookings",
    async ({ clubId , windowHrs, stationTypes }, { rejectWithValue }) => {
        try {
            const response = getUpcomingBookingsForClubApi(
              clubId, windowHrs, stationTypes);
            return response;
        } catch (err: any){
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_DASHBOARD_THUNK_EXCEPTION",
                type: "FETCH_UPCOMING_BOOKINGS",
                message: "Failed to fetch upcoming bookings",
                timestamp: new Date().toISOString()
            });
        }
    }
)

const clubDashboardSlice = createSlice({
    name: "clubDashboard",
    initialState,
    reducers: {
        setSelectedClubId: (state, action: PayloadAction<number>) => {
            state.selectedClubId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClubsForAdminId.pending, (state) => {
                state.clubsLoading = true;
            })
            .addCase(fetchClubsForAdminId.fulfilled, (state, action) => {
                state.clubsLoading = false;
                const clubList = action.payload;
                state.clubs = Object.fromEntries(
                  clubList.map(club => [club.clubId, club])
                );
            })
            .addCase(fetchClubsForAdminId.rejected, (state, action) => {
                state.clubsLoading = false;
                state.clubsError = action.payload?.message;
            })

            .addCase(fetchClubDetails.pending, (state) => {
                state.selectedClubDetailsLoading = true;
            })
            .addCase(fetchClubDetails.fulfilled, (state, action) => {
                state.selectedClubDetailsLoading = false;
                state.selectedClubDetails = action.payload;
            })
            .addCase(fetchClubDetails.rejected, (state, action) => {
                state.selectedClubDetailsLoading = false;
                state.selectedClubDetailsError = action.payload?.message;
            })

            .addCase(fetchStationsByClubId.pending, (state) => {
                state.clubSupportedStationsLoading = true;
            })
            .addCase(fetchStationsByClubId.fulfilled, (state, action) => {
                state.clubSupportedStationsLoading = false;
                const stations = action.payload;
                state.clubSupportedStations = Object.fromEntries(
                  stations.map(station => [station.stationId, station])
                );
            })
            .addCase(fetchStationsByClubId.rejected, (state, action) => {
                state.clubSupportedStationsLoading = false;
                state.clubSupportedStationsError = action.payload?.message;
            })

            .addCase(fetchStationBookingStatus.pending, (state) => {
                state.stationsStatus.stationBookingLoading = true;
            })
            .addCase(fetchStationBookingStatus.fulfilled, (state, action) => {
                state.stationsStatus.stationBookingLoading = false;
                state.stationsStatus.stationBookingState = action.payload;
            })
            .addCase(fetchStationBookingStatus.rejected, (state, action) => {
                state.stationsStatus.stationBookingLoading = false;
                state.stationsStatus.stationBookingError = action.payload?.message;
            })

            .addCase(fetchUpcomingBookings.pending, (state) => {
                state.upcomingBookings.upcomingBookingsLoading = true;
            })
            .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
                state.upcomingBookings.upcomingBookingsLoading = false;
                const bookingList = action.payload;
                state.upcomingBookings.upcomingBookings = Object.fromEntries(
                  bookingList.map(booking => [booking.bookingId, booking])
                );
            })
            .addCase(fetchUpcomingBookings.rejected, (state, action) => {
                state.upcomingBookings.upcomingBookingsLoading = false;
                state.upcomingBookings.upcomingBookingsError = action.payload?.message;
            })
    }
});

export const selectClubDashboardState = (state: RootState) => state.clubDashboard;
export const selectClubs = (state: RootState) => state.clubDashboard.clubs;
export const selectSelectedClubId = (state: RootState) => state.clubDashboard.selectedClubId;
export const selectSelectedClubDetails = (state: RootState) => state.clubDashboard.selectedClubDetails;
export const selectClubsLoading = (state: RootState) => state.clubDashboard.clubsLoading;
export const selectSelectedClubDetailsLoading = (state: RootState) =>state.clubDashboard.selectedClubDetailsLoading;
export const selectClubSupportedStations = (state: RootState) => state.clubDashboard.clubSupportedStations;
export const selectClubSupportedStationsLoading = (state: RootState) => state.clubDashboard.clubSupportedStationsLoading;
export const selectStationBookingStatusMap = (state: RootState) => state.clubDashboard.stationsStatus.stationBookingState;
export const selectStationBookingLoading = (state: RootState) => state.clubDashboard.stationsStatus.stationBookingLoading;
export const selectUpcomingBookingsMap = (state: RootState) => state.clubDashboard.upcomingBookings.upcomingBookings;
export const selectUpcomingBookingsLoading = (state: RootState) => state.clubDashboard.upcomingBookings.upcomingBookingsLoading;
export const selectUpcomingBookingsWindow = (state: RootState) => state.clubDashboard.upcomingBookings.windowHours;
export const selectUpcomingBookingFilterStationTypes = (state: RootState) => state.clubDashboard.upcomingBookings.filterStationType;



export const {
    setSelectedClubId
} = clubDashboardSlice.actions;
export default clubDashboardSlice.reducer;