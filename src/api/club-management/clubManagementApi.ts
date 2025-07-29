import { 
  ClubDetailsResponse, 
  RateCardResponse,
  RateResponse, 
  StationDetailsResponse 
} from "@/api/club/model";
import { 
  CreateClubRequest, 
  ClubResponse, 
  UpdateClubRequest, 
  CreateRateCardRequest, 
  UpdateRateCardRequest, 
  AddRateRequest, 
  UpdateRateRequest, 
  AddStationRequest, 
  UpdateStationRequest 
} from "@/api/club-management/model";

const CLUB_MANAGEMENT_SERVICE_ENDPOINT = "http://localhost:8080/manage/clubs";

function handleApiError(
  errorBody: any, 
  fallbackType: string, 
  fallbackMessage: string
) {
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
export async function createClubApi(
  data: CreateClubRequest
): Promise<ClubResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/createClub`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CREATE_CLUB", "Failed to create club");
  }

  return res.json();
}

export async function getClubsForAdminApi()
: Promise<ClubResponse[]> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/getClubsForAdmin`);

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUBS_FOR_ADMIN_ID",
       `Failed to fetch clubs for clubAdmin`);
  }

  return res.json();
}

export async function updateClubApi(
  clubId: number, 
  data: UpdateClubRequest
): Promise<ClubDetailsResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateClub/${clubId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/createRateCard/${clubId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CREATE_RATE_CARD", 
      "Failed to create rate-card");
  }

  return res.json();
}

export async function updateRateCardApi(
  rateCardId: number,
  request: UpdateRateCardRequest
): Promise<RateCardResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateRateCard/${rateCardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_RATE_CARD",
       "Failed to update rate-card");
  }

  return res.json();
}

export async function deleteRateCardApi(
  rateCardId: number
): Promise<void> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/removeRateCard/${rateCardId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE_CARD",
       "Failed to delete rate-card");
  }

  return res.json();
}

// RATE MANAGEMENT APIs
export async function addRateApi(
  rateCardId: number,
  request: AddRateRequest
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/addRate/${rateCardId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "ADD_RATE", 
      "Failed to add rate");
  }

  return res.json();
}

export async function updateRateApi(
  rateId: number,
  request: UpdateRateRequest
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateRate/${rateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_RATE", 
      "Failed to update rate");
  }

  return res.json();
}

export async function deleteRateApi(
  rateId: number
): Promise<void> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/removeRate/${rateId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE", 
      "Failed to delete rate");
  }

  return res.json();
}

// STATION MANAGEMENT APIs
export async function addStationApi(
  data: AddStationRequest
): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/addStation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "ADD_STATION",
      "Failed to add station");
  }

  return res.json();
}

export async function updateStationApi(
  stationId: number, 
  data: UpdateStationRequest
): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateStation/${stationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_STATION",
      `Failed to update station with id: ${stationId}`);
  }

  return res.json();
}

export async function toggleStationApi(
  stationId: number
): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/toggleStation/${stationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "TOGGLE_STATION_STATUS",
      `Failed to toggle station with id: ${stationId}`);
  }

  return res.json();
}

export async function deleteStationApi(
  stationId: number
): Promise<void> {
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/deleteStation/${stationId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_STATION",
      `Failed to delete station with id: ${stationId}`);
  }
}

