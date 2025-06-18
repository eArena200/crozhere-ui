import { ChargeType, ChargeUnit } from "@/lib/types/rate";
import { StationType } from "@/lib/types/station";

const CLUB_SERVICE_ENDPOINT = "http://localhost:8080";

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

export interface AddStationRequest {
  clubId: number;
  clubAdminId: number;
  stationName: string;
  stationType: StationType;
  operatingHours: OperatingHours;
  capacity: number
}

export interface UpdateStationRequest {
  clubAdminId: number;
  stationName?: string;
  operatingHours?: OperatingHours;
  capacity?: number;
}

export interface StationDetailsResponse {
  stationId: number;
  clubId: number;
  stationName: string;
  stationType: StationType;
  operatingHours: OperatingHours;
  capacity: number;
  isActive: boolean;
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

function handleApiError(errorBody: any, fallbackType: string, fallbackMessage: string) {
  if (errorBody && errorBody.error && errorBody.message) {
    return {
      error: errorBody.error,
      type: errorBody.type || fallbackType,
      message: errorBody.message,
      timestamp: errorBody.timestamp || new Date().toISOString(),
    };
  }
  return {
    error: "CLUB_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}


// CLUB MANAGEMENT APIs
export async function createClub(data: CreateClubRequest): Promise<ClubResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CREATE_CLUB", "Failed to create club");
  }

  return res.json();
}

export async function getClubsForAdminId(clubAdminId: number): Promise<ClubResponse[]> {
  const url = new URL(`${CLUB_SERVICE_ENDPOINT}/manage/clubs`);
  url.searchParams.append("clubAdminId", clubAdminId.toString());
  
  const res = await fetch(url.toString());

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUBS_FOR_ADMIN_ID",
       `Failed to fetch clubs for clubAdminId ${clubAdminId}`);
  }

  return res.json();
}

export async function getClubDetailsById(clubId: number): Promise<ClubDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_BY_ID", `Failed to get club with id: ${clubId}`);
  }
  return res.json();
}

export async function updateClub(clubId: number, data: UpdateClubRequest): Promise<ClubDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_CLUB", `Failed to update club with id: ${clubId}`);
  }

  return res.json();
}

// RATE-CARD MANAGEMENT APIs
export async function createRateCardApi(
  clubId: number, 
  request: CreateRateCardRequest
): Promise<RateCardResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CREATE_RATE_CARD", "Failed to create rate-card");
  }

  return res.json();
}

export async function getRateCardsforClubIdApi(
  clubId: number
): Promise<RateCardResponse[]> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE_CARDS_FOR_CLUB", "Failed to fetch rate-cards for club");
  }

  return res.json();
}

export async function getRateCardDetailsApi(
  clubId: number, 
  rateCardId: number
): Promise<RateCardDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE_CARD_DETAILS", "Failed to fetch rate-card details");
  }

  return res.json();
}


export async function updateRateCardApi(
  clubId: number,
  rateCardId: number,
  request: UpdateRateCardRequest
): Promise<RateCardResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_RATE_CARD", "Failed to update rate-card");
  }

  return res.json();
}

export async function deleteRateCardApi(
  clubId: number,
  rateCardId: number
): Promise<void> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE_CARD", "Failed to delete rate-card");
  }

  return res.json();
}

// RATE MANAGEMENT APIs
export async function addRateApi(
  clubId: number,
  rateCardId: number,
  request: AddRateRequest
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}/rates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "ADD_RATE", "Failed to add rate");
  }

  return res.json();
}

export async function getRatesForRateCardApi(
  clubId: number,
  rateCardId: number
): Promise<RateResponse[]> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}/rates`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATES_FOR_RATE_CARD", "Failed to fetch rates for rate-card");
  }

  return res.json();
}

export async function getRateApi(
  clubId: number,
  rateCardId: number,
  rateId: number
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}/rates/${rateId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE", "Failed to fetch rate");
  }

  return res.json();
}

export async function updateRateApi(
  clubId: number,
  rateCardId: number,
  rateId: number,
  request: UpdateRateRequest
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}/rates/${rateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_RATE", "Failed to update rate");
  }

  return res.json();
}

export async function deleteRateApi(
  clubId: number,
  rateCardId: number,
  rateId: number
): Promise<void> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/clubs/${clubId}/rate-cards/${rateCardId}/rates/${rateId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE", "Failed to delete rate");
  }

  return res.json();
}

// STATION MANAGEMENT APIs
export async function addStation(data: AddStationRequest): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/stations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "ADD_STATION", "Failed to add station");
  }

  return res.json();
}

export async function getStationById(stationId: number): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/stations/${stationId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATION_BY_ID", `Failed to get station with id: ${stationId}`);
  }
  return res.json();
}

export async function updateStation(stationId: number, data: UpdateStationRequest): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/stations/${stationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_STATION", `Failed to update station with id: ${stationId}`);
  }

  return res.json();
}

export async function toggleStationStatus(stationId: number): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/stations/${stationId}/toggle`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "TOGGLE_STATION_STATUS", `Failed to update station with id: ${stationId}`);
  }

  return res.json();
}

export async function deleteStationById(stationId: number): Promise<void> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/manage/stations/${stationId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_STATION", `Failed to delete station with id: ${stationId}`);
  }
}

export async function getStationsByClubId(clubId: number): Promise<StationDetailsResponse[]> {
  const url = new URL(`${CLUB_SERVICE_ENDPOINT}/manage/stations`);
  url.searchParams.append("clubId", clubId.toString());
  
  const res = await fetch(url.toString());

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATIONS_BY_CLUB", `Failed to fetch stations for clubId: ${clubId}`);
  }
  return res.json();
}
