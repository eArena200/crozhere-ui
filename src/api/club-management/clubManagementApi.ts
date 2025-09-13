import { 
  RateChargeResponse,
  ClubResponse, 
  RateCardResponse,
  RateResponse, 
  StationDetailsResponse, 
  RateCardDetailsResponse
} from "@/api/club/model";
import { 
  CreateClubRequest,  
  UpdateClubRequest, 
  CreateRateCardRequest, 
  UpdateRateCardRequest, 
  AddRateRequest, 
  UpdateRateRequest, 
  AddStationRequest, 
  UpdateStationRequest, 
  AddRateChargeRequest,
  UpdateRateChargeRequest
} from "@/api/club-management/model";

const CLUB_MANAGEMENT_SERVICE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/manage/clubs`;

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
export async function getClubsForAdminApi(): Promise<ClubResponse[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/getClubsForAdmin`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUBS_FOR_ADMIN_ID",
       `Failed to fetch clubs for clubAdmin`);
  }

  return res.json();
}

export async function createClubApi(
  data: CreateClubRequest
): Promise<ClubResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/createClub`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CREATE_CLUB", "Failed to create club");
  }

  return res.json();
}

export async function getClubByIdApi(
  clubId: number
): Promise<ClubResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/getClubDetails/${clubId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_DETAILS_BY_ID",
        `Failed to get club details with id: ${clubId}`);
  }
  return res.json();
}

export async function updateClubApi(
  clubId: number, 
  data: UpdateClubRequest
): Promise<ClubResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateClub/${clubId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_CLUB", `Failed to update club with id: ${clubId}`);
  }
  return res.json();
}

// RATE-CARD MANAGEMENT APIs
export async function getRateCardsByClubIdApi(
  clubId: number
): Promise<RateCardDetailsResponse[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/getRateCardsByClubId/${clubId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE_CARDS_FOR_CLUB",
        "Failed to fetch rate-cards for club");
  }

  return res.json();
}

export async function createRateCardApi(
  clubId: number, 
  request: CreateRateCardRequest
): Promise<RateCardDetailsResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/createRateCard/${clubId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateRateCard/${rateCardId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/removeRateCard/${rateCardId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE_CARD",
       "Failed to delete rate-card");
  }
  return;
}

// RATE MANAGEMENT APIs
export async function addRateApi(
  rateCardId: number,
  request: AddRateRequest
): Promise<RateResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/addRate/${rateCardId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateRate/${rateId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/removeRate/${rateId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE", 
      "Failed to delete rate");
  }
  return;
}

// RATE-CHARGE MANAGEMENT APIs
export async function addRateChargeApi(
  rateId: number,
  request: AddRateChargeRequest
): Promise<RateChargeResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/addRateCharge/${rateId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "ADD_RATE_CHARGE", 
      "Failed to add rate charge");
  }
  return res.json();
}

export async function updateRateChargeApi(
  rateChargeId: number,
  request: UpdateRateChargeRequest
): Promise<RateChargeResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateRateCharge/${rateChargeId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify(request),
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "UPDATE_RATE_CHARGE", 
      "Failed to update rate charge");
  }
  return res.json();
}

export async function deleteRateChargeApi(
  rateChargeId: number
): Promise<void> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/removeRateCharge/${rateChargeId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  });
  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_RATE_CHARGE", 
      "Failed to delete rate charge");
  }
}

// STATION MANAGEMENT APIs
export async function getStationsByClubIdApi(
    clubId: number
): Promise<StationDetailsResponse[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/getStationsByClubId/${clubId}`, {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATIONS_BY_CLUB_ID", 
        `Failed to fetch stations by clubId: ${clubId}`);
  }
  return res.json();
}

export async function addStationApi(
  data: AddStationRequest
): Promise<StationDetailsResponse> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/addStation`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/updateStation/${stationId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/toggleStation/${stationId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    }
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
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_MANAGEMENT_SERVICE_ENDPOINT}/deleteStation/${stationId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "DELETE_STATION",
      `Failed to delete station with id: ${stationId}`);
  }
}

