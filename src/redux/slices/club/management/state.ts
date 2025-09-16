import {
  StationDetailsResponse,
  RateCardResponse, 
  RateResponse, 
  ClubResponse,
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