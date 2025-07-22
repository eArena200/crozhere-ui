import { ChargeType, ChargeUnit } from "@/lib/types/rate";
import { StationType } from "@/lib/types/station";
import { ClubAddress, OperatingHours } from "@/api/club/model";

export interface CreateClubRequest {
  clubName: string;
  clubAdminId: number;
  clubAddress: ClubAddress;
  operatingHours: OperatingHours;
  primaryContact: string;
  secondaryContact?: string;
  logo?: string;
  coverImage?: string;
}

export interface UpdateClubRequest {
  clubName?: string;
  clubAdminId: number;
  clubAddress?: ClubAddress;
  operatingHours?: OperatingHours;
  primaryContact?: string;
  secondaryContact?: string;
  logo?: string;
  coverImage?: string;
}

export interface ClubResponse {
  clubId: number;
  clubAdminId: number;
  clubName: string;
}

export interface AddStationRequest {
  clubId: number;
  clubAdminId: number;
  stationName: string;
  stationType: StationType;
  operatingHours: OperatingHours;
  rateId: number;
  capacity: number
}

export interface UpdateStationRequest {
  clubAdminId: number;
  stationName?: string;
  operatingHours?: OperatingHours;
  rateId?: number;
  capacity?: number;
}

export interface CreateRateCardRequest {
  name: string;
}

export interface UpdateRateCardRequest {
  name: string;
}

export interface AddRateRequest {
  rateName: string;
  createChargeRequests: CreateChargeRequest[];
}

export interface UpdateRateRequest {
  rateName: string;
  updateChargeRequests: UpdateChargeRequest[];
}

export interface CreateChargeRequest {
  chargeType: ChargeType;
  chargeUnit: ChargeUnit;
  amount: number;
  startTime?: string | null;
  endTime?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
}

export interface UpdateChargeRequest {
  chargeId?: number | null;
  chargeType: ChargeType;
  chargeUnit: ChargeUnit;
  amount: number;
  startTime?: string | null;
  endTime?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
}