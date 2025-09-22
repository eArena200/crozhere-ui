import { getBookingsForClubApi } from "@/api/booking/clubBookingApi";
import { 
    BookingServiceException,
    BookingsPagenatedListResponse
} from "@/api/booking/model";
import { 
    getClubsForAdminApi,
    getStationsByClubIdApi
} from "@/api/club-management/clubManagementApi";
import { ClubResponse, ClubServiceException } from "@/api/club/model";
import { ClubBookingsState } from "@/redux/slices/club/booking/state";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/redux/store";
import { 
    BookingsColumn,
    BookingsFilters,
    BookingsPagination,
    BookingsSearch,
    BookingsSort
} from "@/lib/types/bookings";
import { StationType } from "@/lib/types/station";


const initialState: ClubBookingsState = {
    clubList: [],
    clubListLoading: false,
    selectedClubBookingsState: {
        supportedStationTypes: [],
        supportedStationTypesLoading: false,
        searchState: {
            searchText: ""
        },
        paginationState: {
            page: 1,
            pageSize: 10,
            totalPages: 0
        },
        filterState: {
            fromDateTime: '',
            toDateTime: '',
            stationTypes: [],
            bookingStatuses: [],
            bookingTypes: []
        },
        sortState: {
            sortBy: "startTime",
            sortOrder: "ASC"
        },
        bookingList: [],
        bookingListLoading: false,

        bookingsListColumns: [
            BookingsColumn.PLAYER_ID,
            BookingsColumn.PLAYER_NAME,
            BookingsColumn.PLAYER_PHONE_NUMBER,
            BookingsColumn.STATION_TYPE,
            BookingsColumn.STATIONS,
            BookingsColumn.START_TIME,
            BookingsColumn.END_TIME,
            BookingsColumn.PLAYER_COUNT,
            BookingsColumn.BOOKING_AMOUNT,
            BookingsColumn.BOOKING_STATUS
        ]
    }
};

export const fetchClubIdsForAdminId = createAsyncThunk<
    ClubResponse[],
    void,
    { dispatch: AppDispatch; rejectValue: ClubServiceException }
>(
  "clubBookings/fetchClubIdsForAdminId",
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
            error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
            type: "FETCH_CLUB_IDS_FOR_ADMIN_ID",
            message: "Failed to fetch club list",
            timestamp: new Date().toISOString()
        });
    }
  }
);


export const setSelectedClubAndFetchDetails = createAsyncThunk<
  void,
  number,
  { dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
  "clubBookings/setSelectedClubAndFetchBookings",
  async (clubId, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setSelectedClubId(clubId));
        dispatch(setFilterState({
            fromDateTime: '',
            toDateTime: '',
            stationTypes: [],
            bookingStatuses: [],
            bookingTypes: []
        }));
        dispatch(setSortState({
            sortBy: "startTime",
            sortOrder: "ASC"
        }));
        dispatch(setSearchState({
            searchText: ''
        }));
        dispatch(setPaginationState({
            page: 1,
            pageSize: 10,
            totalPages: 0
        }));

        dispatch(fetchClubSupportedStations());
        dispatch(fetchClubBookings());
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
        type: "SET_SELECTED_CLUB_AND_FETCH_BOOKINGS",
        message: "Failed to set selected club and fetch bookings",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const fetchClubSupportedStations = createAsyncThunk<
    StationType[],
    void,
    { state: RootState; dispatch: AppDispatch; rejectValue: ClubServiceException }
>(
    "clubBookings/fetchClubSupportedStations",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            const clubId = state.selectedClubId;
            if(!clubId){
                return rejectWithValue({
                    error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                    type: "FETCH_CLUB_SUPPORTED_STATIONS_FAILED",
                    message: "No club selected to fetch supported stations",
                    timestamp: new Date().toISOString()
                });
            }

            const stations = await getStationsByClubIdApi(clubId);
            const supportedStationTypes = Array.from(
                new Set(stations.map(stn => stn.stationType))
            );

            return supportedStationTypes;
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "FETCH_CLUB_SUPPORTED_STATIONS",
                message: "Failed to fetch club supported stations",
                timestamp: new Date().toISOString()
            });
        }
    }
);


export const fetchClubBookings = createAsyncThunk<
    BookingsPagenatedListResponse,
    void,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/fetchClubBookings",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            const clubId = state.selectedClubId;

            if(!clubId){
                return rejectWithValue({
                    error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                    type: "FETCH_CLUB_BOOKINGS_FAILED",
                    message: "No club selected to fetch bookings",
                    timestamp: new Date().toISOString()
                });
            }

            const search = state.selectedClubBookingsState.searchState;
            const sort = state.selectedClubBookingsState.sortState;
            const filter = state.selectedClubBookingsState.filterState;
            const pagination = state.selectedClubBookingsState.paginationState;

            return await getBookingsForClubApi(clubId, filter, pagination);

        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "FETCH_CLUB_BOOKINGS",
                message: "Failed to fetch club bookings",
                timestamp: new Date().toISOString()
            });
        }
    }
);

export const applyFilter = createAsyncThunk<
    void,
    BookingsFilters,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/applyFilter",
    async (filters, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            dispatch(setFilterState(filters));
            dispatch(setPaginationState({
                ...state.selectedClubBookingsState.paginationState,
                page: 1
            }));

            dispatch(fetchClubBookings());
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "APPLY_FILTER",
                message: "Failed to apply filters",
                timestamp: new Date().toISOString()
            });
        }
    }
);

export const resetFilter = createAsyncThunk<
    void,
    void,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/resetFilter",
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            dispatch(setFilterState({
                fromDateTime: '',
                toDateTime: '',
                stationTypes: [],
                bookingStatuses: [],
                bookingTypes: [],
            }));
            dispatch(setPaginationState({
                ...state.selectedClubBookingsState.paginationState,
                page: 1
            }));
            
            dispatch(fetchClubBookings());
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "APPLY_FILTER",
                message: "Failed to apply filters",
                timestamp: new Date().toISOString()
            });
        }
    }
);

export const applySort = createAsyncThunk<
    void,
    BookingsSort,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/applySort",
    async (sort, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            dispatch(setSortState(sort));
            dispatch(setPaginationState({
                ...state.selectedClubBookingsState.paginationState,
                page: 1
            }));
            
            dispatch(fetchClubBookings());
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "APPLY_SORT",
                message: "Failed to apply sort",
                timestamp: new Date().toISOString()
            });
        }
    }
);

export const applySearch = createAsyncThunk<
    void,
    BookingsSearch,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/applySearch",
    async (search, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;

            dispatch(setSearchState(search));
            dispatch(setPaginationState({
                ...state.selectedClubBookingsState.paginationState,
                page: 1
            }));

            dispatch(fetchClubBookings());
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "APPLY_SEARCH",
                message: "Failed to apply search",
                timestamp: new Date().toISOString()
            });
        }
    }
);


export const goToPage = createAsyncThunk<
  void,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
  "clubBookings/goToPage",
  async (page, { getState, dispatch, rejectWithValue }) => {
    try {
        const state = getState().clubBookings;
        dispatch(setPaginationState({
            ...state.selectedClubBookingsState.paginationState,
            page: page
        }));
        dispatch(fetchClubBookings());
    } catch (err: any) {
      if (err.response?.data) return rejectWithValue(err.response.data);
      return rejectWithValue({
        error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
        type: "GO_TO_PAGE",
        message: "Failed to go to page",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export const setPageSize = createAsyncThunk<
    void,
    number,
    { state: RootState; dispatch: AppDispatch; rejectValue: BookingServiceException }
>(
    "clubBookings/setPageSize",
    async (pageSize, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState().clubBookings;
            dispatch(setPaginationState({
                ...state.selectedClubBookingsState.paginationState,
                pageSize: pageSize
            }));
            
            dispatch(fetchClubBookings());
        } catch (err: any) {
            if (err.response?.data) return rejectWithValue(err.response.data);
            return rejectWithValue({
                error: "CLUB_BOOKINGS_THUNK_EXCEPTION",
                type: "SET_PAGE_SIZE",
                message: "Failed to set page size",
                timestamp: new Date().toISOString(),
            });
        }
    }
);


const clubBookingsSlice = createSlice({
    name: "clubBookings",
    initialState,
    reducers: {
        setSelectedClubId: (state, action: PayloadAction<number>) => {
            state.selectedClubId = action.payload;
        },
        setFilterState: (state, action: PayloadAction<BookingsFilters>) => {
            state.selectedClubBookingsState.filterState = action.payload;
        },
        setSortState: (state, action: PayloadAction<BookingsSort>) => {
            state.selectedClubBookingsState.sortState = action.payload;
        },
        setPaginationState: (state, action: PayloadAction<BookingsPagination>) => {
            state.selectedClubBookingsState.paginationState = action.payload;
        },
        setSearchState: (state, action: PayloadAction<BookingsSearch>) => {
            state.selectedClubBookingsState.searchState = action.payload;
        },
        setBookingsListViewColumns: (state, action: PayloadAction<BookingsColumn[]>) => {
            state.selectedClubBookingsState.bookingsListColumns = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClubIdsForAdminId.pending, (state) => {
                state.clubListError = undefined;
                state.clubListLoading = true;
            })
            .addCase(fetchClubIdsForAdminId.fulfilled, (state, action: PayloadAction<ClubResponse[]>) => {
                state.clubListLoading = false;
                state.clubList = action.payload;
            })
            .addCase(fetchClubIdsForAdminId.rejected, (state, action) => {
                state.clubListLoading = false;
                state.clubListError = action.payload?.message;
            })

            .addCase(fetchClubSupportedStations.pending, (state) => {
                state.selectedClubBookingsState.supportedStationTypesError = undefined;
                state.selectedClubBookingsState.supportedStationTypesLoading = false;
            })
            .addCase(fetchClubSupportedStations.fulfilled, (state, action: PayloadAction<StationType[]>) => {
                state.selectedClubBookingsState.supportedStationTypesLoading = false;
                state.selectedClubBookingsState.supportedStationTypes = action.payload;
            })
            .addCase(fetchClubSupportedStations.rejected, (state, action) => {
                state.selectedClubBookingsState.supportedStationTypesLoading = false;
                state.selectedClubBookingsState.supportedStationTypesError = action.payload?.message;
            })

            .addCase(fetchClubBookings.pending, (state) => {
                state.selectedClubBookingsState.bookingListError = undefined;
                state.selectedClubBookingsState.bookingListLoading = true;
            })
            .addCase(fetchClubBookings.fulfilled, (state, action: PayloadAction<BookingsPagenatedListResponse>) => {
                state.selectedClubBookingsState.bookingListLoading = false;
                state.selectedClubBookingsState.bookingList = action.payload.bookings;
                const pageSize = state.selectedClubBookingsState.paginationState.pageSize;
                state.selectedClubBookingsState.paginationState.totalPages 
                    = Math.ceil((action.payload.totalCount) / pageSize);
            })
            .addCase(fetchClubBookings.rejected, (state, action) => {
                state.selectedClubBookingsState.bookingListLoading = false;
                state.selectedClubBookingsState.bookingListError = action.payload?.message;
            });
    }
});


// SELECTORS
export const selectClubBookingsState = (state: RootState) => state.clubBookings;
export const selectSelectedClubId = (state: RootState) => state.clubBookings.selectedClubId;
export const selectSelectedClubBookingsState = (state: RootState) => state.clubBookings.selectedClubBookingsState;


export const { 
    setSelectedClubId,
    setFilterState,
    setSortState,
    setPaginationState,
    setSearchState,
    setBookingsListViewColumns
} = clubBookingsSlice.actions;

export default clubBookingsSlice.reducer;