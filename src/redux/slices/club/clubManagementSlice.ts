import {
  ClubDetailsResponse,
  ClubResponse,
  ClubServiceException,
  CreateClubRequest,
  StationDetailsResponse,
  updateClub,
  UpdateClubRequest
} from "@/api/clubManagementApi";
import {
  getClubsForAdminId,
  getClubDetailsById,
  getStationsByClubId,
  createClub
} from "@/api/clubManagementApi";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { ClubFormData } from "@/components/club-management/CreateOrEditClubForm";

export interface ClubMetaData {
  clubId: number;
  clubName: string;
}

export interface ClubManagementState {
  clubList: ClubMetaData[];
  selectedClubId?: number;
  selectedClubDetails?: ClubDetailsResponse;
  selectedClubStationsDetails?: StationDetailsResponse[];

  loadingClubList: boolean;
  loadingClubDetails: boolean;
  loadingStations: boolean;

  clubListError?: string;
  clubDetailsError?: string;
  stationDetailsError?: string;

  createClubLoading: boolean;
  createClubError?: string;

  updateClubDetailsLoading: boolean;
  updateClubDetailsError?: string;
}

const initialState: ClubManagementState = {
  clubList: [],
  loadingClubList: false,
  loadingClubDetails: false,
  loadingStations: false,
  createClubLoading: false,
  updateClubDetailsLoading: false
};

// THUNKS
export const createNewClub = createAsyncThunk<
  ClubResponse, 
  {
    clubAdminId: number;
    clubFormData: ClubFormData;
  },
  { rejectValue: ClubServiceException}
>(
  "clubManagement/createNewClub",
  async ({clubAdminId, clubFormData}, { dispatch, rejectWithValue }) => {
    try {
      const createClubRequest: CreateClubRequest = {
        clubAdminId: clubAdminId,
        name: clubFormData.clubName
      }
      const response = await createClub(createClubRequest);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "CREATE_NEW_CLUB",
        message: "Failed to create new club",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const updateClubDetails = createAsyncThunk<
  ClubResponse, 
  { 
    clubId: number; 
    updatedClubData: ClubFormData
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateClubDetails",
  async ({clubId, updatedClubData}, { rejectWithValue }) => {
    try {
      const updateClubRequest: UpdateClubRequest = {
        name: updatedClubData.clubName
      }
      const response = await updateClub(clubId, updateClubRequest);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "UPDATE_CLUB_DETAILS",
        message: "Failed to create new club",
        timestamp: new Date().toISOString()
      });
    }
  }
);


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

export const fetchClubDetailsById = createAsyncThunk<
  ClubResponse,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubDetailsById",
  async (clubId, { rejectWithValue }) => {
    try {
      const clubDetails = await getClubDetailsById(clubId);
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
  StationDetailsResponse[],
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
      .addCase(createNewClub.pending, (state) => {
        state.createClubLoading = true;
        state.createClubError = undefined;
      })
      .addCase(createNewClub.fulfilled, (state, action) => {
        state.createClubLoading = false;
        console.log(`CreatedClub: ${JSON.stringify(action.payload)}`);
      })
      .addCase(createNewClub.rejected, (state, action) => {
        state.createClubLoading = false;
        state.clubListError = action.payload?.message;
      })

      .addCase(updateClubDetails.pending, (state) => {
        state.updateClubDetailsLoading = true;
        state.updateClubDetailsError = undefined;
      })
      .addCase(updateClubDetails.fulfilled, (state, action) => {
        state.updateClubDetailsLoading = false;
        console.log(`UpdatedClub: ${JSON.stringify(action.payload)}`);
      })
      .addCase(updateClubDetails.rejected, (state, action) => {
        state.updateClubDetailsLoading = false;
        state.updateClubDetailsError = action.payload?.message;
      })
      
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
        state.stationDetailsError = undefined;
      })
      .addCase(fetchStationsByClubId.fulfilled, (state, action) => {
        state.loadingStations = false;
        state.selectedClubStationsDetails = action.payload;
      })
      .addCase(fetchStationsByClubId.rejected, (state, action) => {
        state.loadingStations = false;
        state.stationDetailsError = action.payload?.message;
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
  state.clubManagement.selectedClubStationsDetails;

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
  state.clubManagement.stationDetailsError;

// EXPORT
export const { setSelectedClubId } = clubManagementSlice.actions;
export default clubManagementSlice.reducer;
