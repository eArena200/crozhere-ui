import { ChargeType, ChargeUnit } from "@/lib/types/rate";
import { StationType } from "@/lib/types/station";

export interface ClubDetailsResponse {
  clubId: number;
  clubName: string;
  clubAddress: ClubAddress;
  operatingHours: OperatingHours;
  primaryContact: string;
  secondaryContact?: string;
  logo?: string;
  coverImage?: string;
}

export interface ClubAddress {
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
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
  name: string;
}

export interface RateCardDetailsResponse {
  rateCardId: number;
  clubId: number;
  name: string;
  rateList: RateResponse[];
}

export interface RateResponse {
  rateId: number;
  rateCardId: number;
  name: string;
  charges: ChargeResponse[];
}

export interface ChargeResponse {
  chargeId: number;
  rateId: number;
  chargeType: ChargeType;
  chargeUnit: ChargeUnit;
  amount: number;
  startTime: string | null;
  endTime: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
}

export interface ClubServiceException {
  error: string;
  type: string;
  message: string;
  timestamp: string;
}