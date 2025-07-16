import { StationType } from "@/lib/types/station";
import { BookingStation } from "@/redux/slices/booking/state";

const CMS_ENDPOINT = "http://localhost:8080";


export interface CheckAvailByTimeRequest {
    clubId: number;
    stationType: StationType;
    startTime: string;
    endTime: string;
}

export interface SearchWindow {
    dateTime: string;
    windowHrs: number;
}

export interface CheckAvailByStationRequest {
    clubId: number;
    stationType: StationType;
    stations: BookingStation[];
    durationHrs: number;
    searchWindow: SearchWindow;
}

export interface StationAvailability {
    stationId: number;
    available: boolean;
}

export interface CheckAvailByTimeResponse {
    clubId: number;
    stationType: StationType;
    stationsAvailability: StationAvailability[];
}

export interface CheckAvailByStationResponse {
    clubId: number;
    stationType: StationType;
    stationIds: number[];
    availableTimes: string[];
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
    error: "CLUB_AVAILABILITY_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}

export async function checkAvailByTimeApi(request:CheckAvailByTimeRequest)
: Promise<CheckAvailByTimeResponse> {
    console.log("Sending ByTimeRequest: ", JSON.stringify(request));
    const res = await fetch(`${CMS_ENDPOINT}/club/availability/by-time`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "CHECK_AVAIL_BY_TIME", 
            "Failed to check availability by time");
    }

    return res.json();
}


export async function checkAvailByStationsApi(request:CheckAvailByStationRequest)
: Promise<CheckAvailByStationResponse> {
    const res = await fetch(`${CMS_ENDPOINT}/club/availability/by-station`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "CHECK_AVAIL_BY_STATIONS", 
            "Failed to check availability by stations");
    }

    return res.json();
}