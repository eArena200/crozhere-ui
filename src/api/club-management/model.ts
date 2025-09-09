import { ChargeType, ChargeUnit, DayOfWeek } from "@/lib/types/rate";
import { StationType } from "@/lib/types/station";
import { ClubAddress, OperatingHours } from "@/api/club/model";

export interface CreateClubRequest {
  clubName: string;
  clubDescription: string;
  clubAddressDetails: ClubAddress;
  operatingHours: OperatingHours;
  primaryContact: string;
  secondaryContact?: string;
}

export interface UpdateClubRequest {
  clubName?: string;
  clubDescription: string;
  clubAddressDetails?: ClubAddress;
  operatingHours?: OperatingHours;
  primaryContact?: string;
  secondaryContact?: string;
}

export interface AddStationRequest {
  clubId: number;
  stationName: string;
  stationDescription: string;
  stationType: StationType;
  operatingHours: OperatingHours;
  rateId: number;
  capacity: number
}

export interface UpdateStationRequest {
  stationName?: string;
  stationDescription?: string;
  operatingHours?: OperatingHours;
  rateId?: number;
  capacity?: number;
}

export interface CreateRateCardRequest {
  rateCardName: string;
  rateCardDescription: string;
}

export interface UpdateRateCardRequest {
  rateCardName: string;
  rateCardDescription: string;
}

export interface AddRateRequest {
  rateName: string;
  rateDescription: string;
}

export interface UpdateRateRequest {
  rateName: string;
  rateDescription: string;
}

export interface AddRateChargeRequest {
  chargeType: ChargeType;
  chargeName: string;
  chargeUnit: ChargeUnit;
  amount: number;
  startTime?: string | null;
  endTime?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  daysOfWeek: DayOfWeek[];
}

export interface UpdateRateChargeRequest {
  chargeType: ChargeType;
  chargeName: string;
  chargeUnit: ChargeUnit;
  amount: number;
  startTime?: string | null;
  endTime?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  daysOfWeek: DayOfWeek[];
}