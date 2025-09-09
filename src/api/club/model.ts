import { ChargeType, ChargeUnit, DayOfWeek } from "@/lib/types/rate";
import { StationType } from "@/lib/types/station";

export interface ClubResponse {
  logo: any;
  coverImage: any;
  clubId: number;
  clubAdminId: number;
  clubName: string;
  clubDescription: string;
  clubAddress: ClubAddress;
  operatingHours: OperatingHours;
  primaryContact: string;
  secondaryContact?: string;
}

export interface ClubDetailsResponse {
  clubName: string;
  clubDescription: string;
  clubAddress: any;
  operatingHours: any;
  primaryContact: string;
  secondaryContact: string | undefined;
  clubDetails: ClubResponse;
  clubStations: StationDetailsResponse[];
  clubRateCards: RateCardDetailsResponse[];
}

export interface ClubAddress {
  streetAddress: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  geoLocation: {
    latitude?: number;
    longitude?: number;
  }
}

export interface OperatingHours {
  openTime: string;
  closeTime: string;
}

export interface StationDetailsResponse {
  stationId: number;
  clubId: number;
  stationName: string;
  stationDescription: string;
  stationType: StationType;
  operatingHours: OperatingHours;
  capacity: number;
  rateId: number;
  rateName: string;
  isActive: boolean;
}

export interface RateCardResponse {
  rateCardId: number;
  clubId: number;
  rateCardName: string;
  rateCardDescription: string;
}

export interface RateCardDetailsResponse {
  rateCardId: number;
  clubId: number;
  rateCardName: string;
  rateCardDescription: string;
  rateList: RateResponse[];
}

export interface RateResponse {
  rateId: number;
  rateCardId: number;
  rateName: string;
  rateDescription: string;
  rateCharges: RateChargeResponse[];
}

export interface RateChargeResponse {
  chargeId: number;
  rateId: number;
  chargeType: ChargeType;
  chargeUnit: ChargeUnit;
  chargeName: string;
  amount: number;
  startTime?: string;
  endTime?: string;
  minPlayers?: number;
  maxPlayers?: number;
  daysOfWeek: DayOfWeek[];
}

export interface ClubServiceException {
  error: string;
  type: string;
  message: string;
  timestamp: string;
}