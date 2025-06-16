import {
  addStation,
  AddStationRequest,
  ClubDetailsResponse,
  ClubResponse,
  ClubServiceException,
  CreateClubRequest,
  deleteStationById,
  StationDetailsResponse,
  toggleStationStatus,
  updateClub,
  UpdateClubRequest,
  updateStation,
  UpdateStationRequest
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
import { ClubFormData } from "@/components/club-management/ClubForm";
import { StationFormData } from "@/components/club-management/StationForm";

export interface ClubMetaData {
  clubId: number;
  clubName: string;
}

export interface ClubManagementState {
  clubList: ClubResponse[];
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

  updateClubLoading: boolean;
  updateClubError?: string;

  addStationLoading: boolean;
  addStationError?: string;

  updateStationLoading: boolean;
  updateStationError?: string;

  toggleStationLoading: boolean;
  toggleStationError?: string;

  deleteStationLoading: boolean;
  deleteStationError?: string;
}

const initialState: ClubManagementState = {
  clubList: [],
  loadingClubList: false,
  loadingClubDetails: false,
  loadingStations: false,
  createClubLoading: false,
  updateClubLoading: false,
  addStationLoading: false,
  updateStationLoading: false,
  deleteStationLoading: false,
  toggleStationLoading: false
};

// THUNKS
export const fetchClubIdsForAdminId = createAsyncThunk<
  ClubResponse[],
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubIdsForAdminId",
  async (adminId, { dispatch, rejectWithValue }) => {
    try {
      const clubList = await getClubsForAdminId(adminId);
      if (clubList.length > 0) {
        dispatch(setSelectedClubAndFetchDetails(clubList[0].clubId));
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

export const setSelectedClubAndFetchDetails = createAsyncThunk<
  void,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/setSelectedClubAndFetchDetails",
  async (clubId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSelectedClubId(clubId));
      await Promise.all([
        dispatch(fetchClubDetailsById(clubId)).unwrap(),
        dispatch(fetchStationsByClubId(clubId)).unwrap()
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



// CLUB THUNKS
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
        clubName: clubFormData.clubName,
        clubAddress: {
          streetAddress: clubFormData.address.street,
          city: clubFormData.address.city,
          state: clubFormData.address.state,
          pinCode: clubFormData.address.pincode
        },
        operatingHours: {
          openTime: clubFormData.openTime,
          closeTime: clubFormData.closeTime
        },
        primaryContact: clubFormData.primaryContact,
        secondaryContact: clubFormData.secondaryContact
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
  ClubDetailsResponse, 
  { 
    clubId: number;
    clubAdminId: number;
    updatedClubData: ClubFormData
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateClubDetails",
  async ({clubId, clubAdminId, updatedClubData}, { dispatch, rejectWithValue }) => {
    try {
      const updateClubRequest: UpdateClubRequest = {
        clubAdminId: clubAdminId,
        clubName: updatedClubData.clubName,
        clubAddress: {
          streetAddress: updatedClubData.address.street,
          city: updatedClubData.address.city,
          state: updatedClubData.address.state,
          pinCode: updatedClubData.address.pincode
        },
        operatingHours: {
          openTime: updatedClubData.openTime,
          closeTime: updatedClubData.closeTime
        },
        primaryContact: updatedClubData.primaryContact,
        secondaryContact: updatedClubData.secondaryContact
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
        message: "Failed to update club",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const fetchClubDetailsById = createAsyncThunk<
  ClubDetailsResponse,
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

// STATION THUNKS
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

export const addNewStation = createAsyncThunk<
  StationDetailsResponse,
  { clubAdminId: number, clubId: number, stationFormData: StationFormData},
  { rejectValue: ClubServiceException }
>(
  "clubManagement/addNewStation",
  async({clubAdminId, clubId, stationFormData}, {dispatch, rejectWithValue}) => {
    try {
      const addStationRequest: AddStationRequest = {
        clubId: clubId,
        clubAdminId: clubAdminId,
        stationName: stationFormData.stationName,
        stationType: stationFormData.stationType,
        operatingHours: {
          openTime: stationFormData.openTime,
          closeTime: stationFormData.closeTime
        },
        capacity: stationFormData.capacity
      }
      
      const response = await addStation(addStationRequest);
      return response;
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "ADD_NEW_STATION",
        message: "Failed to add new station",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const updateStationDetails = createAsyncThunk<
  StationDetailsResponse,
  { clubAdminId: number, stationId: number, stationFormData: StationFormData},
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateStationDetails",
  async({clubAdminId, stationId, stationFormData}, {dispatch, rejectWithValue}) => {
    try {
      const UpdateStationRequest: UpdateStationRequest = {
        clubAdminId: clubAdminId,
        stationName: stationFormData.stationName,
        operatingHours: {
          openTime: stationFormData.openTime,
          closeTime: stationFormData.closeTime
        },
        capacity:stationFormData.capacity
      }
      
      const response = await updateStation(stationId, UpdateStationRequest);
      return response;
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "UPDATE_STATION_DETAILS",
        message: "Failed to update station",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const toggleStation = createAsyncThunk<
  StationDetailsResponse,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/toggleStation",
  async(stationId, {dispatch, rejectWithValue}) => {
    try {
      const response = await toggleStationStatus(stationId);
      return response;
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "TOGGLE_STATION_STATUS",
        message: "Failed to toggle station status",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const deleteStation = createAsyncThunk<
  void,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/deleteStation",
  async(stationId, {dispatch, rejectWithValue}) => {
    try {
      await deleteStationById(stationId);
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "DELETE_STATION",
        message: "Failed to delete station",
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
        // TODO: Remove this log
        console.log(`CreatedClub: ${JSON.stringify(action.payload)}`);
      })
      .addCase(createNewClub.rejected, (state, action) => {
        state.createClubLoading = false;
        state.clubListError = action.payload?.message;
      })

      .addCase(updateClubDetails.pending, (state) => {
        state.updateClubLoading = true;
        state.updateClubError = undefined;
      })
      .addCase(updateClubDetails.fulfilled, (state, action) => {
        state.updateClubLoading = false;
        const updatedClub = action.payload;
        state.selectedClubDetails = updatedClub;
        const index = state.clubList.findIndex(club => club.clubId === updatedClub.clubId);
        if (index !== -1) {
          state.clubList[index] = {
            ...state.clubList[index],
            ...updatedClub,
          };
        }
      })
      .addCase(updateClubDetails.rejected, (state, action) => {
        state.updateClubLoading = false;
        state.updateClubError = action.payload?.message;
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

      .addCase(addNewStation.pending, (state) => {
        state.addStationLoading = true;
        state.addStationError = undefined;
      })
      .addCase(addNewStation.fulfilled, (state, action) => {
        state.addStationLoading = false;
        const addedStation = action.payload;
        state.selectedClubStationsDetails?.push(addedStation);
      })
      .addCase(addNewStation.rejected, (state, action) => {
        state.addStationLoading = false;
        state.addStationError = action.payload?.message;
      })

      .addCase(updateStationDetails.pending, (state) => {
        state.updateStationLoading = true;
        state.updateStationError = undefined;
      })
      .addCase(updateStationDetails.fulfilled, (state, action) => {
        state.updateStationLoading = false;
        const updatedStationDetails = action.payload;
        const index = state.selectedClubStationsDetails?.findIndex(
          (station) => station.stationId === updatedStationDetails.stationId);
        
        if (index !== undefined && index !== -1 && state.selectedClubStationsDetails) {
          state.selectedClubStationsDetails[index] = {
            ...state.selectedClubStationsDetails[index],
            ...updatedStationDetails,
          };
        }
      })
      .addCase(updateStationDetails.rejected, (state, action) => {
        state.updateStationLoading = false;
        state.updateStationError = action.payload?.message;
      })

      .addCase(toggleStation.pending, (state) => {
        state.toggleStationLoading = true;
        state.toggleStationError = undefined;
      })
      .addCase(toggleStation.fulfilled, (state, action) => {
        state.toggleStationLoading = false;
        const updatedStationDetails = action.payload;
        const index = state.selectedClubStationsDetails?.findIndex(
          (station) => station.stationId === updatedStationDetails.stationId);
        
        if (index !== undefined && index !== -1 && state.selectedClubStationsDetails) {
          state.selectedClubStationsDetails[index] = {
            ...state.selectedClubStationsDetails[index],
            ...updatedStationDetails,
          };
        }
      })
      .addCase(toggleStation.rejected, (state, action) => {
        state.toggleStationLoading = false;
        state.toggleStationError = action.payload?.message;
      })

      .addCase(deleteStation.pending, (state) => {
        state.deleteStationLoading = true;
        state.deleteStationError = undefined;
      })
      .addCase(deleteStation.fulfilled, (state, action) => {
        state.deleteStationLoading = false;
        const deletedStationId = action.meta.arg;
        state.selectedClubStationsDetails = state.selectedClubStationsDetails?.filter(
          (station) => station.stationId !== deletedStationId
        );
      })
      .addCase(deleteStation.rejected, (state, action) => {
        state.deleteStationLoading = false;
        state.deleteStationError = action.payload?.message;
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
