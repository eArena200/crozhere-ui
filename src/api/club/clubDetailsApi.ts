import { 
    ClubDetailsResponse,
    StationDetailsResponse 
} from "@/api/club/model";

const CLUB_SERVICE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/clubs`;

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
        `Failed to get club details with id: ${clubId}`);
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
  const res = await fetch(`${CLUB_SERVICE_ENDPOINT}/getStationsForClub/${clubId}`);

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_STATIONS_BY_CLUB", 
        `Failed to fetch stations for clubId: ${clubId}`);
  }
  return res.json();
}