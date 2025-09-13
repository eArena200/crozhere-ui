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
import { RateChargeFormData } from "@/components/club-management/RateChargeForm";
import { 
  createRateCardApi, 
  updateRateCardApi, 
  addRateApi, 
  updateRateApi, 
  deleteRateApi, 
  getClubsForAdminApi,
  getClubByIdApi,
  createClubApi,
  updateClubApi,
  addStationApi,
  updateStationApi,
  toggleStationApi,
  deleteStationApi,
  deleteRateCardApi,
  addRateChargeApi,
  updateRateChargeApi,
  deleteRateChargeApi,
  getRateCardsByClubIdApi,
  getStationsByClubIdApi
} from "@/api/club-management/clubManagementApi";
import { 
  CreateRateCardRequest, 
  UpdateRateCardRequest, 
  AddRateRequest, 
  UpdateRateRequest, 
  CreateClubRequest, 
  UpdateClubRequest, 
  AddStationRequest, 
  UpdateStationRequest,
  AddRateChargeRequest,
  UpdateRateChargeRequest
} from "@/api/club-management/model";
import {
  StationDetailsResponse,
  ClubServiceException, 
  RateCardResponse, 
  RateResponse, 
  ClubResponse,
  RateChargeResponse,
} from "@/api/club/model";

export interface RateCardState {
  details: RateCardResponse;
  rates: Record<number, RateResponse>;
}

export interface ClubManagementState {
  clubList: ClubResponse[];
  clubListLoading: boolean;
  clubListError?: string;

  createClubLoading: boolean;
  createClubError?: string;

  selectedClubId?: number;
  selectedClubLoading: boolean;
  selectedClubError?: string;
  selectedClubState: {
    detailState: {
      details?: ClubResponse;

      clubDetailsLoading: boolean;
      clubDetailsError?: string;

      updateClubLoading: boolean;
      updateClubError?: string;
    };
    rateState: {
      rateCards: Record<number, RateCardState>;
      selectedRateCardId?: number;
      rateCardsLoading: boolean;
      rateCardsError?: string;

      createRateCardLoading: boolean;
      createRateCardError?: string;

      updateRateCardLoading: boolean;
      updateRateCardError?: string;

      deleteRateCardLoading: boolean;
      deleteRateCardError?: string;

      addRateLoading: boolean;
      addRateError?: string;

      updateRateLoading: boolean;
      updateRateError?: string;

      deleteRateLoading: boolean;
      deleteRateError?: string;

      addRateChargeLoading: boolean;
      addRateChargeError?: string;

      updateRateChargeLoading: boolean;
      updateRateChargeError?: string;

      deleteRateChargeLoading: boolean;
      deleteRateChargeError?: string;
    };
    stationState: {
      stations: Record<number, StationDetailsResponse>;
      stationsLoading: boolean;
      stationsError?: string;

      addStationLoading: boolean;
      addStationError?: string;

      updateStationLoading: boolean;
      updateStationError?: string;

      toggleStationLoading: boolean;
      toggleStationError?: string;

      deleteStationLoading: boolean;
      deleteStationError?: string;
    };
  }
}

const initialState: ClubManagementState = {
  clubList: [],
  clubListLoading: false,
  createClubLoading: false,
  selectedClubLoading: false,
  selectedClubState: {
    detailState: {
      clubDetailsLoading: false,
      updateClubLoading: false,
    },
    rateState: {
      rateCards: {},
      rateCardsLoading: false,
      createRateCardLoading: false,
      updateRateCardLoading: false,
      deleteRateCardLoading: false,
      addRateLoading: false,
      updateRateLoading: false,
      deleteRateLoading: false,
      addRateChargeLoading: false,
      updateRateChargeLoading: false,
      deleteRateChargeLoading: false,
    },
    stationState: {
      stations: {},
      stationsLoading: false,
      addStationLoading: false,
      updateStationLoading: false,
      toggleStationLoading: false,
      deleteStationLoading: false
    }
  }
}

// THUNKS
export const fetchClubIdsForAdminId = createAsyncThunk<
  ClubResponse[],
  void,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubIdsForAdminId",
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
        dispatch(fetchRateCardsForClub(clubId)).unwrap()
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

export const fetchClubDetailsById = createAsyncThunk<
  ClubResponse,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchClubDetailsById",
  async (clubId, { rejectWithValue }) => {
    try {
      const club = await getClubByIdApi(clubId);
      return club;
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

export const createNewClub = createAsyncThunk<
  ClubResponse, 
  {
    clubFormData: ClubFormData;
  },
  { rejectValue: ClubServiceException}
>(
  "clubManagement/createNewClub",
  async ({clubFormData}, { dispatch, rejectWithValue }) => {
    try {
      const createClubRequest: CreateClubRequest = {
        clubName: clubFormData.clubName,
        clubDescription: clubFormData.clubDescription,
        clubAddressDetails: {
          streetAddress: clubFormData.address.street,
          area: clubFormData.address.area,
          city: clubFormData.address.city,
          state: clubFormData.address.state,
          pinCode: clubFormData.address.pincode,
          geoLocation: {
            latitude: clubFormData.address.coordinates?.latitude,
            longitude: clubFormData.address.coordinates?.longitude
          }
        },
        operatingHours: {
          openTime: clubFormData.openTime,
          closeTime: clubFormData.closeTime
        },
        primaryContact: clubFormData.primaryContact,
        secondaryContact: clubFormData.secondaryContact
      }
      const response = await createClubApi(createClubRequest);
      dispatch(setSelectedClubAndFetchDetails(response.clubId));
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
  async ({clubId, updatedClubData}, { dispatch, rejectWithValue }) => {
    try {
      const updateClubRequest: UpdateClubRequest = {
        clubName: updatedClubData.clubName,
        clubDescription: updatedClubData.clubDescription,
        clubAddressDetails: {
          streetAddress: updatedClubData.address.street,
          area: updatedClubData.address.area,
          city: updatedClubData.address.city,
          state: updatedClubData.address.state,
          pinCode: updatedClubData.address.pincode,
          geoLocation: {
            latitude: updatedClubData.address.coordinates?.latitude,
            longitude: updatedClubData.address.coordinates?.longitude
          }
        },
        operatingHours: {
          openTime: updatedClubData.openTime,
          closeTime: updatedClubData.closeTime
        },
        primaryContact: updatedClubData.primaryContact,
        secondaryContact: updatedClubData.secondaryContact
      }
      const response = await updateClubApi(clubId, updateClubRequest);
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

// RATE-CARD THUNKS
export const fetchRateCardsForClub = createAsyncThunk<
  Record<number, RateCardState>,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchRateCardsForClub",
  async (clubId, { dispatch, rejectWithValue }) => {
    try {
      const rateCardList = await getRateCardsByClubIdApi(clubId);

      if(rateCardList.length <= 0){
        return {};
      }

      dispatch(setSelectedRateCardId(rateCardList[0].rateCardId));

      const rateCardRecord: Record<number, RateCardState> = Object.fromEntries(
        rateCardList.map(
          (rateCard) => [
            rateCard.rateCardId,
            {
              details: {
                ...rateCard
              } as RateCardResponse,
              rates: Object.fromEntries(rateCard.rateList.map((rate) => [rate.rateId, rate]))
            } as RateCardState
          ]
        )
      );
      return rateCardRecord;
    } catch (err: any){
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "FETCH_RATE_CARDS_FOR_CLUB",
        message: "Failed to fetch rate-card records",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const createRateCard = createAsyncThunk<
  RateCardState,
  {
    clubId: number;
    rateCardFormData: RateCardFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/createRateCard",
  async ({ clubId, rateCardFormData }, { rejectWithValue }) => {
    try {
      const request: CreateRateCardRequest = {
        rateCardName: rateCardFormData.rateCardName,
        rateCardDescription: rateCardFormData.rateCardDescription
      }
      const response = await createRateCardApi(clubId, request);

      const rateCardState: RateCardState = {
        details: {
          ...response
        },
        rates: {}
      }

      return rateCardState;
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
  rateCardId: number;
  data: RateCardFormData;
 },
 {
  rejectValue: ClubServiceException
 }
>(
  "clubManagement/updateRateCard",
  async ({rateCardId, data}, {rejectWithValue}) => {
    try {
      const request: UpdateRateCardRequest = {
        rateCardName: data.rateCardName,
        rateCardDescription: data.rateCardDescription
      }
      const response = await updateRateCardApi(rateCardId, request);
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

export const deleteRateCard = createAsyncThunk<
  void,
  number,
  {
    rejectValue: ClubServiceException
  }
>(
  "clubManagement/deleteRateCard",
  async (rateCardId, {rejectWithValue}) => {
    try {
      await deleteRateCardApi(rateCardId);
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

// RATE THUNKS
export const addRate = createAsyncThunk<
  RateResponse,
  {
    rateCardId: number;
    data: RateFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/addRate",
  async ({ rateCardId, data }, { rejectWithValue }) => {
    try {
      const request: AddRateRequest = {
        rateName: data.rateName,
        rateDescription: data.rateDescription
      }
      const response = addRateApi(rateCardId, request);
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
    rateId: number;
    data: RateFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateRate",
  async ({ rateId, data }, { rejectWithValue }) => {
    try {
      const request: UpdateRateRequest = {
        rateName: data.rateName,
        rateDescription: data.rateDescription
      }
      const response = await updateRateApi(rateId, request);
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
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/deleteRate",
  async (rateId, { rejectWithValue }) => {
    try {
      await deleteRateApi(rateId);
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


// RATE-CHARGE THUNKS
export const addRateCharge = createAsyncThunk<
  RateChargeResponse,
  {
    rateId: number;
    data: RateChargeFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/addRateCharge",
  async ({ rateId, data }, { rejectWithValue }) => {
    try {
      const request: AddRateChargeRequest = {
        chargeType: data.chargeType,
        chargeName: data.chargeName,
        chargeUnit: data.chargeUnit,
        startTime: data.startTime,
        endTime: data.endTime,
        minPlayers: data.minPlayers,
        maxPlayers: data.maxPlayers,
        amount: data.chargeAmount,
        daysOfWeek: []
      }
      const response = addRateChargeApi(rateId, request);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        error: "CLUB_MANAGEMENT_THUNK_EXCEPTION",
        type: "ADD_RATE_CHARGE",
        message: "Failed to add rate-charge",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export const updateRateCharge = createAsyncThunk<
  RateChargeResponse,
  {
    rateChargeId: number;
    data: RateChargeFormData;
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateRateCharge",
  async ({ rateChargeId, data }, { rejectWithValue }) => {
    try {
      const request: UpdateRateChargeRequest = {
        chargeType: data.chargeType,
        chargeName: data.chargeName,
        chargeUnit: data.chargeUnit,
        startTime: data.startTime,
        endTime: data.endTime,
        minPlayers: data.minPlayers,
        maxPlayers: data.maxPlayers,
        amount: data.chargeAmount,
        daysOfWeek: []
      }
      const response = await updateRateChargeApi(rateChargeId, request);
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

export const deleteRateCharge = createAsyncThunk<
  void,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/deleteRateCharge",
  async (rateChargeId, { rejectWithValue }) => {
    try {
      await deleteRateChargeApi(rateChargeId);
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


// STATION THUNKS
export const fetchStationsByClubId = createAsyncThunk<
  Record<number, StationDetailsResponse>,
  number,
  { rejectValue: ClubServiceException }
>(
  "clubManagement/fetchStationsByClubId",
  async (clubId, { rejectWithValue }) => {
    try {
      const stations = await getStationsByClubIdApi(clubId);
      return Object.fromEntries(
        stations.map((station) => [station.stationId, station])
      );
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
  {
    clubId: number, 
    stationFormData: StationFormData
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/addNewStation",
  async({clubId, stationFormData}, { rejectWithValue }) => {
    try {
      const addStationRequest: AddStationRequest = {
        clubId: clubId,
        stationName: stationFormData.stationName,
        stationDescription: stationFormData.stationDescription,
        stationType: stationFormData.stationType,
        operatingHours: {
          openTime: stationFormData.openTime,
          closeTime: stationFormData.closeTime
        },
        rateId: stationFormData.rateId,
        capacity: stationFormData.capacity
      }
      
      const response = await addStationApi(addStationRequest);
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
  { 
    stationId: number, 
    stationFormData: StationFormData
  },
  { rejectValue: ClubServiceException }
>(
  "clubManagement/updateStationDetails",
  async({stationId, stationFormData}, { rejectWithValue }) => {
    try {
      const updateStationRequest: UpdateStationRequest = {
        stationName: stationFormData.stationName,
        stationDescription: stationFormData.stationDescription,
        operatingHours: {
          openTime: stationFormData.openTime,
          closeTime: stationFormData.closeTime
        },
        rateId: stationFormData.rateId,
        capacity:stationFormData.capacity
      }
      const response = await updateStationApi(stationId, updateStationRequest);
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
  async(stationId, { rejectWithValue }) => {
    try {
      const response = await toggleStationApi(stationId);
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
  async(stationId, { rejectWithValue }) => {
    try {
      await deleteStationApi(stationId);
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
      state.selectedClubState.rateState.selectedRateCardId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubIdsForAdminId.pending, (state) => {
        state.clubListLoading = true;
        state.clubListError = undefined;
      })
      .addCase(fetchClubIdsForAdminId.fulfilled, (state, action) => {
        state.clubListLoading = false;
        state.clubList = action.payload;
      })
      .addCase(fetchClubIdsForAdminId.rejected, (state, action) => {
        state.clubListLoading = false;
        state.clubListError = action.payload?.message;
      })

      .addCase(fetchClubDetailsById.pending, (state) => {
        state.selectedClubState.detailState.clubDetailsLoading = true;
        state.selectedClubState.detailState.clubDetailsError = undefined;
      })
      .addCase(fetchClubDetailsById.fulfilled, (state, action) => {
        state.selectedClubState.detailState.clubDetailsLoading = false;
        state.selectedClubState.detailState.details = action.payload;
      })
      .addCase(fetchClubDetailsById.rejected, (state, action) => {
        state.selectedClubState.detailState.clubDetailsLoading = false;
        state.selectedClubState.detailState.clubDetailsError = action.payload?.message;
      })

      .addCase(createNewClub.pending, (state) => {
        state.createClubLoading = true;
        state.createClubError = undefined;
      })
      .addCase(createNewClub.fulfilled, (state, action) => {
        state.createClubLoading = false;
        state.clubList.push(action.payload);
      })
      .addCase(createNewClub.rejected, (state, action) => {
        state.createClubLoading = false;
        state.createClubError = action.payload?.message;
      })

      .addCase(updateClubDetails.pending, (state) => {
        state.selectedClubState.detailState.updateClubLoading = true;
        state.selectedClubState.detailState.updateClubError = undefined;
      })
      .addCase(updateClubDetails.fulfilled, (state, action) => {
        state.selectedClubState.detailState.updateClubLoading = false;
        const index = state.clubList.findIndex(club => club.clubId === action.payload.clubId);
        if (index !== -1) {
          state.clubList[index] = {
            ...state.clubList[index],
            ...action.payload,
          };
        }
        state.selectedClubState.detailState.details = action.payload;
      })
      .addCase(updateClubDetails.rejected, (state, action) => {
        state.selectedClubState.detailState.updateClubLoading = false;
        state.selectedClubState.detailState.updateClubError = action.payload?.message;
      })


      .addCase(fetchRateCardsForClub.pending, (state) => {
        state.selectedClubState.rateState.rateCardsLoading = true;
        state.selectedClubState.rateState.rateCardsError = undefined;
      })
      .addCase(fetchRateCardsForClub.fulfilled, (state, action) => {
        state.selectedClubState.rateState.rateCardsLoading = false;
        state.selectedClubState.rateState.rateCards = action.payload;
      })
      .addCase(fetchRateCardsForClub.rejected, (state, action) => {
        state.selectedClubState.rateState.rateCardsLoading = false;
        state.selectedClubState.rateState.rateCardsError = action.payload?.message;
      })

      .addCase(createRateCard.pending, (state) => {
        state.selectedClubState.rateState.createRateCardLoading = true;
        state.selectedClubState.rateState.createRateCardError = undefined;
      })
      .addCase(createRateCard.fulfilled, (state, action) => {
        state.selectedClubState.rateState.createRateCardLoading = false;
        state.selectedClubState.rateState.rateCards[action.payload.details.rateCardId] = action.payload
      })
      .addCase(createRateCard.rejected, (state, action) => {
        state.selectedClubState.rateState.createRateCardLoading = false;
        state.selectedClubState.rateState.createRateCardError = action.payload?.message;
      })

      .addCase(updateRateCard.pending, (state) => {
        state.selectedClubState.rateState.updateRateCardLoading = true;
        state.selectedClubState.rateState.updateRateCardError = undefined;
      })
      .addCase(updateRateCard.fulfilled, (state, action) => {
        state.selectedClubState.rateState.updateRateCardLoading = false;
        state.selectedClubState.rateState.rateCards[action.payload.rateCardId].details = action.payload
      })
      .addCase(updateRateCard.rejected, (state, action) => {
        state.selectedClubState.rateState.updateRateCardLoading = false;
        state.selectedClubState.rateState.updateRateCardError = action.payload?.message;
      })

      .addCase(deleteRateCard.pending, (state) => {
        state.selectedClubState.rateState.deleteRateCardLoading = true;
        state.selectedClubState.rateState.deleteRateCardError = undefined;
      })
      .addCase(deleteRateCard.fulfilled, (state, action) => {
        state.selectedClubState.rateState.deleteRateCardLoading = false;
        delete state.selectedClubState.rateState.rateCards[action.meta.arg];
      })
      .addCase(deleteRateCard.rejected, (state, action) => {
        state.selectedClubState.rateState.deleteRateCardLoading = false;
        state.selectedClubState.rateState.deleteRateCardError = action.payload?.message;
      })

      .addCase(addRate.pending, (state) => {
        state.selectedClubState.rateState.addRateLoading = true;
        state.selectedClubState.rateState.addRateError = undefined;
      })
      .addCase(addRate.fulfilled, (state, action) => {
        state.selectedClubState.rateState.addRateLoading = false;
        const rate = action.payload;
        state.selectedClubState.rateState.rateCards[rate.rateCardId].rates[rate.rateId] = rate;
      })
      .addCase(addRate.rejected, (state, action) => {
        state.selectedClubState.rateState.addRateLoading = false;
        state.selectedClubState.rateState.addRateError = action.payload?.message;
      })


      .addCase(updateRate.pending, (state) => {
        state.selectedClubState.rateState.updateRateLoading = true;
        state.selectedClubState.rateState.updateRateError = undefined;
      })
      .addCase(updateRate.fulfilled, (state, action) => {
        state.selectedClubState.rateState.updateRateLoading = false;
        const rate = action.payload;
        state.selectedClubState.rateState.rateCards[rate.rateCardId].rates[rate.rateId] = rate;
      })
      .addCase(updateRate.rejected, (state, action) => {
        state.selectedClubState.rateState.updateRateLoading = false;
        state.selectedClubState.rateState.updateRateError = action.payload?.message;
      })


      .addCase(deleteRate.pending, (state) => {
        state.selectedClubState.rateState.deleteRateLoading = true;
        state.selectedClubState.rateState.deleteRateError = undefined;
      })
      .addCase(deleteRate.fulfilled, (state, action) => {
        state.selectedClubState.rateState.deleteRateLoading = false;
        const rateId = action.meta.arg;
        
        for (const cardId in state.selectedClubState.rateState.rateCards) {
          const rateCard = state.selectedClubState.rateState.rateCards[cardId];
          if (rateCard.rates[rateId]) {
            delete rateCard.rates[rateId];
            break;
          }
        }
      })
      .addCase(deleteRate.rejected, (state, action) => {
        state.selectedClubState.rateState.deleteRateLoading = false;
        state.selectedClubState.rateState.deleteRateError = action.payload?.message;
      })
      

      .addCase(addRateCharge.pending, (state) => {
        state.selectedClubState.rateState.addRateChargeLoading = true;
        state.selectedClubState.rateState.addRateChargeError = undefined;
      })
      .addCase(addRateCharge.fulfilled, (state, action) => {
        state.selectedClubState.rateState.addRateChargeLoading = false;

        const rateId = action.payload.rateId;
        for(const cardId in state.selectedClubState.rateState.rateCards) {
          const rateCard = state.selectedClubState.rateState.rateCards[cardId];
          if(rateCard.rates[rateId]){
            rateCard.rates[rateId].rateCharges.push(action.payload);
            break;
          }
        }
      })
      .addCase(addRateCharge.rejected, (state, action) => {
        state.selectedClubState.rateState.addRateChargeLoading = false;
        state.selectedClubState.rateState.addRateChargeError = action.payload?.message;
      })


      .addCase(updateRateCharge.pending, (state) => {
        state.selectedClubState.rateState.updateRateChargeLoading = true;
        state.selectedClubState.rateState.updateRateChargeError = undefined;
      })
      .addCase(updateRateCharge.fulfilled, (state, action) => {
        state.selectedClubState.rateState.updateRateChargeLoading = false;

        const { rateId, chargeId } = action.payload;
        for (const cardId in state.selectedClubState.rateState.rateCards) {
          const rateCard = state.selectedClubState.rateState.rateCards[cardId];
          if (rateCard.rates[rateId]) {
            const charges = rateCard.rates[rateId].rateCharges;
            const idx = charges.findIndex((c) => c.chargeId === chargeId);
            if (idx !== -1) {
              charges[idx] = action.payload;
            }
            break;
          }
        }
      })
      .addCase(updateRateCharge.rejected, (state, action) => {
        state.selectedClubState.rateState.updateRateChargeLoading = false;
        state.selectedClubState.rateState.updateRateChargeError = action.payload?.message;
      })

      .addCase(deleteRateCharge.pending, (state) => {
        state.selectedClubState.rateState.deleteRateChargeLoading = true;
        state.selectedClubState.rateState.deleteRateChargeError = undefined;
      })
      .addCase(deleteRateCharge.fulfilled, (state, action) => {
        state.selectedClubState.rateState.deleteRateChargeLoading = false;

        const chargeId = action.meta.arg;

        for (const cardId in state.selectedClubState.rateState.rateCards) {
          const rateCard = state.selectedClubState.rateState.rateCards[cardId];

          for (const rateId in rateCard.rates) {
            const charges = rateCard.rates[rateId].rateCharges;
            const idx = charges.findIndex((c) => c.chargeId === chargeId);

            if (idx !== -1) {
              charges.splice(idx, 1);
              return;
            }
          }
        }
      })
      .addCase(deleteRateCharge.rejected, (state, action) => {
        state.selectedClubState.rateState.deleteRateChargeLoading = false;
        state.selectedClubState.rateState.deleteRateChargeError = action.payload?.message;
      })


      .addCase(fetchStationsByClubId.pending, (state) => {
        state.selectedClubState.stationState.stationsLoading = true;
        state.selectedClubState.stationState.stationsError = undefined;
      })
      .addCase(fetchStationsByClubId.fulfilled, (state, action) => {
        state.selectedClubState.stationState.stationsLoading = false;
        state.selectedClubState.stationState.stations = action.payload;
      })
      .addCase(fetchStationsByClubId.rejected, (state, action) => {
        state.selectedClubState.stationState.stationsLoading = false;
        state.selectedClubState.stationState.stationsError = action.payload?.message;
      })

      .addCase(addNewStation.pending, (state) => {
        state.selectedClubState.stationState.addStationLoading = true;
        state.selectedClubState.stationState.addStationError = undefined;
      })
      .addCase(addNewStation.fulfilled, (state, action) => {
        state.selectedClubState.stationState.addStationLoading = false;
        state.selectedClubState.stationState.stations[action.payload.stationId] = (action.payload);
      })
      .addCase(addNewStation.rejected, (state, action) => {
        state.selectedClubState.stationState.addStationLoading = false;
        state.selectedClubState.stationState.addStationError = action.payload?.message;
      })

      .addCase(updateStationDetails.pending, (state) => {
        state.selectedClubState.stationState.updateStationLoading = true;
        state.selectedClubState.stationState.updateStationError = undefined;
      })
      .addCase(updateStationDetails.fulfilled, (state, action) => {
        state.selectedClubState.stationState.updateStationLoading = false;
        state.selectedClubState.stationState.stations[action.payload.stationId] = (action.payload);
      })
      .addCase(updateStationDetails.rejected, (state, action) => {
        state.selectedClubState.stationState.updateStationLoading = false;
        state.selectedClubState.stationState.updateStationError = action.payload?.message;
      })

      .addCase(toggleStation.pending, (state) => {
        state.selectedClubState.stationState.toggleStationLoading = true;
        state.selectedClubState.stationState.toggleStationError = undefined;
      })
      .addCase(toggleStation.fulfilled, (state, action) => {
        state.selectedClubState.stationState.toggleStationLoading = false;
        state.selectedClubState.stationState.stations[action.payload.stationId] = (action.payload);
      })
      .addCase(toggleStation.rejected, (state, action) => {
        state.selectedClubState.stationState.toggleStationLoading = false;
        state.selectedClubState.stationState.toggleStationError = action.payload?.message;
      })

      .addCase(deleteStation.pending, (state) => {
        state.selectedClubState.stationState.deleteStationLoading = true;
        state.selectedClubState.stationState.deleteStationError = undefined;
      })
      .addCase(deleteStation.fulfilled, (state, action) => {
        state.selectedClubState.stationState.deleteStationLoading = false;
        delete state.selectedClubState.stationState.stations[action.meta.arg];
      })
      .addCase(deleteStation.rejected, (state, action) => {
        state.selectedClubState.stationState.deleteStationLoading = false;
        state.selectedClubState.stationState.deleteStationError = action.payload?.message;
      })
  }
});

// SELECTORS
export const selectClubManagementState = (state: RootState) => state.clubManagement;

export const selectSelectedClubId = (state: RootState) => state.clubManagement.selectedClubId;
export const selectSelectedClubDetailState = (state: RootState) => state.clubManagement.selectedClubState.detailState;
export const selectSelectedClubRateState = (state: RootState) => state.clubManagement.selectedClubState.rateState;
export const selectSelectedClubStationState = (state: RootState) => state.clubManagement.selectedClubState.stationState;

// EXPORT
export const { 
  setSelectedClubId,
  setSelectedRateCardId
} = clubManagementSlice.actions;
export default clubManagementSlice.reducer;

