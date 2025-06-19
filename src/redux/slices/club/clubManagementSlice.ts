import {
  addRateApi,
  AddRateRequest,
  addStation,
  AddStationRequest,
  ClubAddress,
  ClubDetailsResponse,
  ClubResponse,
  ClubServiceException,
  CreateClubRequest,
  createRateCardApi,
  CreateRateCardRequest,
  deleteRateApi,
  deleteStationById,
  getRateCardDetailsApi,
  getRateCardsforClubIdApi,
  OperatingHours,
  RateCardDetailsResponse,
  RateCardResponse,
  RateResponse,
  StationDetailsResponse,
  toggleStationStatus,
  updateClub,
  UpdateClubRequest,
  updateRateApi,
  updateRateCardApi,
  UpdateRateCardRequest,
  UpdateRateRequest,
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
import { RateCardFormData } from "@/components/club-management/RateCardForm";
import { RateFormData } from "@/components/club-management/RateForm";

export interface ClubMetaData {
  clubId: number;
  clubName: string;
}

export interface ClubDetailsState {
  clubId: number;
  clubName: string;
  clubAddress: ClubAddress;
  operatingHours: OperatingHours;
  primaryContact: string;
  secondaryContact?: string;
  logo?: string;
  coverImage?: string;
}

export interface ClubManagementState {
  clubList: ClubResponse[];
  selectedClubId?: number;
  selectedClubDetails?: ClubDetailsResponse;
  selectedClubStationsDetails?: StationDetailsResponse[];

  rateCardList?: RateCardDetailsResponse[];
  selectedRateCardId?: number;
  selectedRateCardDetails?: RateCardDetailsResponse;

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

  rateCardListLoading: boolean;
  rateCardListError?: string;

  selectedRateCardDetailsLoading: boolean;
  selectedRateCardDetailsError?: string;

  createRateCardLoading: boolean;
  createRateCardError?: string;

  updateRateCardLoading: boolean;
  updateRateCardError?: string;

  addRateLoading: boolean;
  addRateError?: string;

  updateRateLoading: boolean;
  updateRateError?: string;

  deleteRateLoading: boolean;
  deleteRateError?: string;
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
  toggleStationLoading: false,
  rateCardListLoading: false,
  selectedRateCardDetailsLoading: false,
  createRateCardLoading: false,
  updateRateCardLoading: false,
  addRateLoading: false,
  updateRateLoading: false,
  deleteRateLoading: false
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
        dispatch(fetchStationsByClubId(clubId)).unwrap(),
        dispatch(fetchRateCardsForClubId(clubId)).unwrap()
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

// RATE THUNKS
export const fetchRateCardsForClubId = createAsyncThunk<
  RateCardDetailsResponse[],
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchRateCardsForClubId",
  async (clubId, { dispatch, rejectWithValue }) => {
    try {
      const rateCardList = await getRateCardsforClubIdApi(clubId);
      if(rateCardList.length > 0){
        dispatch(setSelectedRateCardAndFetchDetails(rateCardList[0]));
      }

      return rateCardList;
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_RATE_CARDS_FOR_CLUB_ID",
        message: "Failed to fetch rate-card list",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const setSelectedRateCardAndFetchDetails = createAsyncThunk<
  void,
  RateCardDetailsResponse,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/setSelectedRateCardAndFetchDetails",
  async (rateCardResponse: RateCardDetailsResponse, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setSelectedRateCardId(rateCardResponse.rateCardId));
      await Promise.all([
        dispatch(fetchRateCardDetails(rateCardResponse)).unwrap()
      ]);
    } catch (err: any) {
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }

      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "SET_SELECTED_RATE_CARD_AND_FETCH_DETAILS",
        message: "Failed to fetch rate-card details",
        timestamp: new Date().toISOString()
      });
    }
  }
);


export const fetchRateCardDetails = createAsyncThunk<
  RateCardDetailsResponse,
  RateCardResponse,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchRateCardDetails",
  async (rateCardResponse, { rejectWithValue }) => {
    try {
      const rateCardDetailsResponse = await getRateCardDetailsApi(
        rateCardResponse.clubId, rateCardResponse.rateCardId);
      return rateCardDetailsResponse;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_RATE_CARD_DETAILS",
        message: "Failed to fetch club details",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const createRateCard = createAsyncThunk<
  RateCardResponse,
  {
    clubId: number;
    rateCardFormData: RateCardFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/createRateCard",
  async ({ clubId, rateCardFormData }, { dispatch, rejectWithValue }) => {
    try {
      const request: CreateRateCardRequest = {
        name: rateCardFormData.rateCardName
      }
      const response = createRateCardApi(clubId, request);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "CREATE_RATE_CARD",
        message: "Failed to create new rate-card",
        timestamp: new Date().toISOString()
      });
    }
  }
);


export const updateRateCard = createAsyncThunk<
 RateCardResponse,
 {
  clubId: number;
  rateCardId: number;
  data: RateCardFormData;
 },
 {
  rejectValue: ClubServiceException
 }
>(
  "clubManagement/updateRateCard",
  async ({clubId, rateCardId, data}, {dispatch, rejectWithValue}) => {
    try {
      const request: UpdateRateCardRequest = {
        name: data.rateCardName
      }
      const response = await updateRateCardApi(clubId, rateCardId, request);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "UPDATE_RATE_CARD",
        message: "Failed to update rate-card",
        timestamp: new Date().toISOString()
      });
    }
  }
);


export const addRate = createAsyncThunk<
 RateResponse,
 {
  clubId: number;
  rateCardId: number;
  data: RateFormData;
 },
 { rejectValue: ClubServiceException }
>(
  "clubManagement/addRate",
  async ({ clubId, rateCardId, data }, { dispatch, rejectWithValue }) => {
    try {
      const request: AddRateRequest = {
        rateName: data.rateName,
        createChargeRequests: data.charges.map(charge => ({
          chargeType: charge.chargeType,
          chargeUnit: charge.chargeUnit,
          amount: charge.amount,
          startTime: charge.startTime,
          endTime: charge.endTime,
          minPlayers: charge.minPlayers,
          maxPlayers: charge.maxPlayers
        }))
      }
      console.log("AddRateRequest: ", JSON.stringify(request));

      const response = addRateApi(clubId, rateCardId, request);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "ADD_RATE",
        message: "Failed to add rate",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const updateRate = createAsyncThunk<
RateResponse,
 {
  clubId: number;
  rateCardId: number;
  rateId: number;
  data: RateFormData;
 },
 { rejectValue: ClubServiceException }
>(
  "clubManagement/updateRate",
  async ({ clubId, rateCardId, rateId, data }, { dispatch, rejectWithValue }) => {
    try {
      const request: UpdateRateRequest = {
        rateName: data.rateName,
        updateChargeRequests: data.charges.map(charge => ({
          chargeId: charge.chargeId,
          chargeType: charge.chargeType,
          chargeUnit: charge.chargeUnit,
          amount: charge.amount,
          startTime: charge.startTime,
          endTime: charge.endTime,
          minPlayers: charge.minPlayers,
          maxPlayers: charge.maxPlayers
        }))
      }
      console.log("UpdateRateRequest: ", JSON.stringify(request));
      const response = await updateRateApi(clubId, rateCardId, rateId, request);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "UPDATE_RATE",
        message: "Failed to update rate",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const deleteRate = createAsyncThunk<
void,
 {
  clubId: number;
  rateCardId: number;
  rateId: number;
 },
 { rejectValue: ClubServiceException }
>(
  "clubManagement/deleteRate",
  async ({ clubId, rateCardId, rateId }, { dispatch, rejectWithValue }) => {
    try {
      await deleteRateApi(clubId, rateCardId, rateId);
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "DELETE_RATE",
        message: "Failed to delete rate",
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
        rateId: stationFormData.rateId,
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
        rateId: stationFormData.rateId,
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
    },
    setSelectedRateCardId: (state, action: PayloadAction<number>) => {
      state.selectedRateCardId = action.payload;
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

      .addCase(fetchRateCardsForClubId.pending, (state) => {
        state.rateCardListLoading = true;
        state.rateCardListError = undefined;
      })
      .addCase(fetchRateCardsForClubId.fulfilled, (state, action) => {
        state.rateCardListLoading = false;
        state.rateCardList = action.payload;
      })
      .addCase(fetchRateCardsForClubId.rejected, (state, action) => {
        state.rateCardListLoading = false;
        state.rateCardListError = action.payload?.message;
      })
      
      .addCase(fetchRateCardDetails.pending, (state) => {
        state.selectedRateCardDetailsLoading = true;
        state.selectedRateCardDetailsError = undefined;
      })
      .addCase(fetchRateCardDetails.fulfilled, (state, action) => {
        state.selectedRateCardDetailsLoading = false;
        state.selectedRateCardDetails = action.payload;
      })
      .addCase(fetchRateCardDetails.rejected, (state, action) => {
        state.selectedRateCardDetailsLoading = false;
        state.selectedRateCardDetailsError = action.payload?.message;
      })

      .addCase(createRateCard.pending, (state) => {
        state.createRateCardLoading = true;
        state.createRateCardError = undefined;
      })
      .addCase(createRateCard.fulfilled, (state, action) => {
        state.createRateCardLoading = false;
        // TODO: Remove this log
        console.log(`CreatedRateCard: ${JSON.stringify(action.payload)}`);
      })
      .addCase(createRateCard.rejected, (state, action) => {
        state.createRateCardLoading = false;
        state.createRateCardError = action.payload?.message;
      })

      .addCase(updateRateCard.pending, (state) => {
        state.updateRateCardLoading = true;
        state.updateRateCardError = undefined;
      })
      .addCase(updateRateCard.fulfilled, (state, action) => {
        state.updateRateCardLoading = false;
        // TODO: Remove this log
        console.log(`UpdatedRateCard: ${JSON.stringify(action.payload)}`);
      })
      .addCase(updateRateCard.rejected, (state, action) => {
        state.updateRateCardLoading = false;
        state.updateRateCardError = action.payload?.message;
      })

      .addCase(addRate.pending, (state) => {
        state.addRateLoading = true;
        state.addRateError = undefined;
      })
      .addCase(addRate.fulfilled, (state, action) => {
        state.addRateLoading = false;
        // TODO: Remove this log
        console.log(`AddedRate: ${JSON.stringify(action.payload)}`);
      })
      .addCase(addRate.rejected, (state, action) => {
        state.addRateLoading = false;
        state.addRateError = action.payload?.message;
      })

      .addCase(updateRate.pending, (state) => {
        state.updateRateLoading = true;
        state.updateRateError = undefined;
      })
      .addCase(updateRate.fulfilled, (state, action) => {
        state.updateRateLoading = false;
        // TODO: Remove this log
        console.log(`UpdatedRate: ${JSON.stringify(action.payload)}`);
      })
      .addCase(updateRate.rejected, (state, action) => {
        state.updateRateLoading = false;
        state.updateRateError = action.payload?.message;
      })

      .addCase(deleteRate.pending, (state) => {
        state.deleteRateLoading = true;
        state.deleteRateError = undefined;
      })
      .addCase(deleteRate.fulfilled, (state, action) => {
        state.deleteRateLoading = false;
        // TODO: Remove this log
        console.log(`Deleted Rate`);
      })
      .addCase(deleteRate.rejected, (state, action) => {
        state.deleteRateLoading = false;
        state.deleteRateError = action.payload?.message;
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
export const { 
  setSelectedClubId, 
  setSelectedRateCardId 
} = clubManagementSlice.actions;
export default clubManagementSlice.reducer;
