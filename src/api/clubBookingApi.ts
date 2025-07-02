import { BookingsFilters, BookingsPagination } from "@/lib/types/bookings";
import { StationType } from "@/lib/types/station";

const CMS_ENDPOINT = "http://localhost:8080";


export interface CreateBookingIntentRequest {
    playerId: number | null;
    playerPhoneNumber: string;
    clubId: number;
    stationIds: number[];
    stationType: StationType;
    startTime: string;
    endTime: string;
    players: number;
}

export interface BookingIntentResponse {
    intentId: number;
    clubId: number;
    playerId: number;
    startTime: string;
    endTime: string;
    expiresAt: string;
    stationType: StationType;
    stationIds: number[];
    players: number;
    isConfirmed: boolean;
    totalCost: number;
}


export interface BookingsPagenatedListResponse {
    bookings: BookingResponse[];
    totalCount: number;
}

export interface BookingResponse {
    bookingId: number;
    clubId: number;
    playerId: number;
    startTime: string;
    endTime: string;
    players: number;
    stationType: StationType;
    stationIds: number[];
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
    error: "BOOKING_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}


// BOOKING INTENTS
export async function createBookingIntentApi(request: CreateBookingIntentRequest) 
: Promise<BookingIntentResponse> {
    
    const res = await fetch(`${CMS_ENDPOINT}/manage/clubs/${request.clubId}/bookings/intents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "CREATE_BOOKING_INTENT",
        `Failed to create booking intent`);
    }

    return res.json();
}

export async function getBookingIntentDetails(clubId: number, intentId: number)
: Promise<BookingIntentResponse> {
    const res = await fetch(`${CMS_ENDPOINT}/manage/clubs/${clubId}/bookings/intents/${intentId}`);

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "GET_BOOKING_INTENT_DETAILS",
            `Failed to get booking-intent details with intentId: ${intentId}`);
    }
    return res.json();
}


// BOOKINGS
export async function getBookingsForClubApi(
  clubId: number,
  bookingsFilter?: BookingsFilters,
  pagination?: BookingsPagination
): Promise<BookingsPagenatedListResponse> {
  const params = new URLSearchParams();

  if (bookingsFilter?.fromDateTime)
    params.append('fromDateTime', bookingsFilter.fromDateTime);

  if (bookingsFilter?.toDateTime)
    params.append('toDateTime', bookingsFilter.toDateTime);

  if (bookingsFilter?.stationTypes?.length)
    params.append('stationTypes', bookingsFilter.stationTypes.join(','));

  if (bookingsFilter?.bookingStatuses?.length)
    params.append('bookingStatuses', bookingsFilter.bookingStatuses.join(','));

  if (bookingsFilter?.bookingTypes?.length)
    params.append('bookingTypes', bookingsFilter.bookingTypes.join(','));

  if (pagination?.page)
    params.append('page', pagination.page.toString());

  if (pagination?.pageSize)
    params.append('pageSize', pagination.pageSize.toString());

  const url = `${CMS_ENDPOINT}/manage/clubs/${clubId}/bookings?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(
      errBody,
      'GET_BOOKINGS_FOR_CLUB',
      `Failed to get bookings for ClubId: ${clubId}`
    );
  }

  return res.json();
}


export async function getBookingDetailsForClubApi(clubId:number, bookingId: number)
: Promise<BookingResponse> {
    const res = await fetch(`${CMS_ENDPOINT}/manage/clubs/${clubId}/bookings/${bookingId}`);

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "GET_BOOKINGS_FOR_CLUB",
            `Failed to get booking details for bookingId: ${bookingId}`);
    }
    return res.json();
}
