import {
  ClubResponse,
  ClubServiceException,
  StationResponse
} from "@/api/clubApi";
import {
  getClubsForAdminId,
  getClubById,
  getStationsByClubId
} from "@/api/clubApi";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export interface ClubMetaData {
  clubId: number;
  clubName: string;
}

export interface ClubManagementState {
  clubList: ClubMetaData[];
  selectedClubId?: number;
  selectedClubDetails?: ClubResponse;
  selectedClubStations?: StationResponse[];

  loadingClubList: boolean;
  loadingClubDetails: boolean;
  loadingStations: boolean;

  clubListError?: string;
  clubDetailsError?: string;
  stationError?: string;
}

const initialState: ClubManagementState = {
  clubList: [],
  loadingClubList: false,
  loadingClubDetails: false,
  loadingStations: false
};

// THUNKS
export const fetchClubIdsForAdminId = createAsyncThunk<
  ClubMetaData[],
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubIdsForAdminId",
  async (adminId, { dispatch, rejectWithValue }) => {
    try {
      const clubsForAdminId = await getClubsForAdminId(adminId);
      const clubList = clubsForAdminId.map((club) => ({
        clubId: club.clubId,
        clubName: club.name
      }));

      if (clubList.length > 0) {
        dispatch(setSelectedClubId(clubList[0].clubId));
      }

      return clubList;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_CLUB_IDS_FOR_ADMIN_ID",
        message: "Failed to fetch club list",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const selectClubById = createAsyncThunk<void, number>(
  "clubManagement/selectClubById",
  async (clubId, { dispatch }) => {
    dispatch(setSelectedClubId(clubId));
    await dispatch(fetchClubDetailsById(clubId));
    await dispatch(fetchStationsByClubId(clubId));
  }
);

export const fetchClubDetailsById = createAsyncThunk<
  ClubResponse,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubDetailsById",
  async (clubId, { rejectWithValue }) => {
    try {
      const clubDetails = await getClubById(clubId);
      return clubDetails;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_CLUB_DETAILS_BY_ID",
        message: "Failed to fetch club details",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const fetchStationsByClubId = createAsyncThunk<
  StationResponse[],
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchStationsByClubId",
  async (clubId, { rejectWithValue }) => {
    try {
      const stations = await getStationsByClubId(clubId);
      return stations;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_STATIONS_BY_CLUB_ID",
        message: "Failed to fetch stations",
        timestamp: new Date().toISOString()
      });
    }
  }
);

// SLICE
const clubManagementSlice = createSlice({
  name: "clubManagement",
  initialState,
  reducers: {
    setSelectedClubId: (state, action: PayloadAction<number>) => {
      state.selectedClubId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchClubIdsForAdminId.pending, (state) => {
        state.loadingClubList = true;
        state.clubListError = undefined;
      })
      .addCase(fetchClubIdsForAdminId.fulfilled, (state, action) => {
        state.loadingClubList = false;
        state.clubList = action.payload;
      })
      .addCase(fetchClubIdsForAdminId.rejected, (state, action) => {
        state.loadingClubList = false;
        state.clubListError = action.payload?.message;
      })

      
      .addCase(fetchClubDetailsById.pending, (state) => {
        state.loadingClubDetails = true;
        state.clubDetailsError = undefined;
      })
      .addCase(fetchClubDetailsById.fulfilled, (state, action) => {
        state.loadingClubDetails = false;
        state.selectedClubDetails = action.payload;
      })
      .addCase(fetchClubDetailsById.rejected, (state, action) => {
        state.loadingClubDetails = false;
        state.clubDetailsError = action.payload?.message;
      })

      .addCase(fetchStationsByClubId.pending, (state) => {
        state.loadingStations = true;
        state.stationError = undefined;
      })
      .addCase(fetchStationsByClubId.fulfilled, (state, action) => {
        state.loadingStations = false;
        state.selectedClubStations = action.payload;
      })
      .addCase(fetchStationsByClubId.rejected, (state, action) => {
        state.loadingStations = false;
        state.stationError = action.payload?.message;
      });
  }
});

// SELECTORS
export const selectClubManagementState = (state: RootState) => state.clubManagement;

export const selectSelectedClubId = (state: RootState) =>
  state.clubManagement.selectedClubId;

export const selectSelectedClubDetails = (state: RootState) =>
  state.clubManagement.selectedClubDetails;

export const selectSelectedClubStationDetails = (state: RootState) =>
  state.clubManagement.selectedClubStations;

// Loading
export const selectLoadingClubList = (state: RootState) =>
  state.clubManagement.loadingClubList;

export const selectLoadingClubDetails = (state: RootState) =>
  state.clubManagement.loadingClubDetails;

export const selectLoadingStations = (state: RootState) =>
  state.clubManagement.loadingStations;

// Errors
export const selectClubListError = (state: RootState) =>
  state.clubManagement.clubListError;

export const selectClubDetailsError = (state: RootState) =>
  state.clubManagement.clubDetailsError;

export const selectStationError = (state: RootState) =>
  state.clubManagement.stationError;

// EXPORT
export const { setSelectedClubId } = clubManagementSlice.actions;
export default clubManagementSlice.reducer;
