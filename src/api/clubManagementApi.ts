import { StationType } from "@/lib/types/station";

const CLUBSERVICE_ENDPOINT = "http://localhost:8080";

export interface ClubAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  location?: {
    latitude: number;
    longitude: number;
  }
}

export interface CreateClubRequest {
  name: string;
  clubAdminId: number;
  logo?: string;
  coverImage?: string;
  address?: ClubAddress;
  openTime?: string;
  closeTime?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
}

export interface UpdateClubRequest {
  name: string;
  logo?: string;
  coverImage?: string;
  address?: ClubAddress;
  openTime?: string;
  closeTime?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
}

export interface ClubResponse {
  clubId: number;
  clubAdminId: number;
  clubLayoutId: string;
  name: string;
}

export interface ClubDetailsResponse {
  clubId: number;
  name: string;
  logo?: string;
  coverImage?: string;
  location?: ClubAddress;
  openTime?: string;
  closeTime?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
}

export interface AddStationRequest {
  clubId: number;
  stationName: string;
  stationType: StationType;
  stationGroupLayoutId: string;
  openTime?: string;
  closeTime?: string;
  pricePerHour?: string;
}

export interface UpdateStationRequest {
  stationName: string;
  openTime?: string;
  closeTime?: string;
  pricePerHour?: string;
}

export interface StationDetailsResponse {
  stationId: number;
  clubId: number;
  stationName: string;
  stationType: StationType;
  stationGroupLayoutId: string;
  stationLayoutId: string;
  isActive: boolean;
  pricePerHour?: number;
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

export async function createClub(data: CreateClubRequest): Promise<ClubResponse> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs`, {
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
  const url = new URL(`${CLUBSERVICE_ENDPOINT}/clubs`);
  url.searchParams.append("clubAdminId", clubAdminId.toString());
  
  const res = await fetch(url.toString());

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_ALL_CLUBS", "Failed to fetch clubs");
  }

  return res.json();
}

export async function getClubDetailsById(clubId: number): Promise<ClubResponse> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_BY_ID", `Failed to get club with id: ${clubId}`);
  }
  return res.json();
}

export async function updateClub(clubId: number, data: UpdateClubRequest): Promise<ClubResponse> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`, {
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

export async function deleteClub(clubId: number): Promise<void> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_CLUB", `Failed to delete club with id: ${clubId}`);
  }
}

export async function addStation(data: AddStationRequest): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations`, {
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
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATION_BY_ID", `Failed to get station with id: ${stationId}`);
  }
  return res.json();
}

export async function updateStation(stationId: number, data: UpdateStationRequest): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`, {
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

export async function deleteStation(stationId: number): Promise<void> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_STATION", `Failed to delete station with id: ${stationId}`);
  }
}

export async function getStationsByClubId(clubId: number): Promise<StationDetailsResponse[]> {
  const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations?clubId=${clubId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATIONS_BY_CLUB", `Failed to fetch stations for clubId: ${clubId}`);
  }
  return res.json();
}
