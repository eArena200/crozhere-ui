import { 
    ClubDetailsResponse, 
    RateCardDetailsResponse, 
    RateResponse, 
    StationDetailsResponse 
} from "@/api/club/model";

const CLUB_SERVICE_ENDPOINT = "http://localhost:8080/clubs";

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

export async function getClubDetailsApi(
  clubId: number
): Promise<ClubDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getClubDetails/${clubId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_BY_ID",
        `Failed to get club with id: ${clubId}`);
  }
  return res.json();
}

export async function getStationDetailsApi(
    stationId: number
): Promise<StationDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getStationDetails/${stationId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATION_BY_ID",
        `Failed to get station with id: ${stationId}`);
  }
  return res.json();
}

export async function getStationsInClubApi(
    clubId: number
): Promise<StationDetailsResponse[]> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getStationForClub/${clubId}`);

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATIONS_BY_CLUB", 
        `Failed to fetch stations for clubId: ${clubId}`);
  }
  return res.json();
}

export async function getRateCardsforClubApi(
  clubId: number
): Promise<RateCardDetailsResponse[]> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getRateCardsForClub/${clubId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE_CARDS_FOR_CLUB",
        "Failed to fetch rate-cards for club");
  }

  return res.json();
}

export async function getRateCardDetailsApi(
  rateCardId: number
): Promise<RateCardDetailsResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getRateCard/${rateCardId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE_CARD_DETAILS",
        "Failed to fetch rate-card details");
  }

  return res.json();
}

export async function getRatesInRateCardApi(
  rateCardId: number
): Promise<RateResponse[]> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getRatesInRateCard/${rateCardId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATES_FOR_RATE_CARD", 
      "Failed to fetch rates for rate-card");
  }

  return res.json();
}

export async function getRateDetailsApi(
  rateId: number
): Promise<RateResponse> {
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getRate/${rateId}`);

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_RATE", "Failed to fetch rate");
  }

  return res.json();
}
