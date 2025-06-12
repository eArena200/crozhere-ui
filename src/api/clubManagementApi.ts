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
