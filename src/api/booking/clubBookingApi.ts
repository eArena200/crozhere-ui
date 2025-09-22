import { 
  BookingsFilters, 
  BookingsPagination 
} from "@/lib/types/bookings";
import { 
  BookingDetailsResponse, 
  BookingIntentDetailsResponse, 
  BookingsPagenatedListResponse, 
  ClubDiscountRequest, 
  CreateClubBookingIntentRequest, 
  DashboardStationBookingStatus 
} from "@/api/booking/model";
import { 
  StationType 
} from "@/lib/types/station";


const CLUB_BOOKING_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/booking/club`;

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
    error: "BOOKING_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}

// BOOKING INTENTS
export async function createClubBookingIntentApi(
  request: CreateClubBookingIntentRequest
) : Promise<BookingIntentDetailsResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/createBookingIntent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "CREATE_CLUB_BOOKING_INTENT",
        `Failed to create booking intent for club`);
    }

    return res.json();
}

export async function applyClubDiscountApi(
  bookingIntentId: number,
  request: ClubDiscountRequest
): Promise<BookingIntentDetailsResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/applyClubDiscount/${bookingIntentId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "APPLY_CLUB_DISCOUNT",
        `Failed to apply discount on booking intent for club`);
    }

    return res.json();
}

export async function getActiveIntentsForClubApi(
  clubId: number
) : Promise<BookingIntentDetailsResponse[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/getActiveIntents/${clubId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_ACTIVE_INTENTS_FOR_CLUB",
      `Failed to get active booking-intents for clubId: ${clubId}`);
  }

  return res.json();
}

export async function cancelBookingIntentForClubApi(
  clubId:number, 
  intentId: number
) : Promise<void>{
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/cancelBookingIntent/${clubId}/${intentId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CANCEL_CLUB_BOOKING_INTENT",
        `Failed to cancel club booking-intent intentId: ${intentId}`);
  }
}

// BOOKINGS
export async function getClubBookingDetailsByIntentIdApi(
  clubId: number, 
  intentId: number
) : Promise<BookingDetailsResponse>{
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/getBookingByIntentId/${clubId}/${intentId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_BOOKING_DETAILS_BY_INTENT_ID",
            `Failed to fetch club booking details for intentId: ${intentId}`);
  }

  return res.json();
}

export async function getClubBookingDetailsApi(
  clubId: number,
  bookingId: number
) : Promise<BookingDetailsResponse>{
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/getBookingDetails/${clubId}/${bookingId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if(!res.ok){
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "GET_CLUB_BOOKING_DETAILS",
            `Failed to fetch club booking details for bookingId: ${bookingId}`);
  }

  return res.json();
}

export async function cancelBookingForClubApi(
  clubId:number, 
  bookingId: number
) : Promise<void>{
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/cancelBooking/${clubId}/${bookingId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(errBody, "CANCEL_CLUB_BOOKING",
        `Failed to cancel club booking with bookingId: ${bookingId}`);
  }
}

export async function getBookingsForClubApi(
  clubId: number,
  bookingsFilter?: BookingsFilters,
  pagination?: BookingsPagination
): Promise<BookingsPagenatedListResponse> {
  const params = new URLSearchParams();
  
  const requestBody = {
    ...bookingsFilter,
    fromDateTime: convertLocalToUTCTime(bookingsFilter?.fromDateTime),
    toDateTime: convertLocalToUTCTime(bookingsFilter?.toDateTime)
  };

  if (pagination?.page)
    params.append('page', pagination.page.toString());

  if (pagination?.pageSize)
    params.append('pageSize', pagination.pageSize.toString());

  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/getBookings/${clubId}?${params.toString()}`, {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify(requestBody)
  });

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

export async function getUpcomingBookingsForClubApi(
  clubId: number, 
  windowHrs: number = 12, 
  stationTypes?: StationType[]
): Promise<BookingDetailsResponse[]> {
  const params = new URLSearchParams();
  params.append('window', windowHrs.toString());

  if (stationTypes && stationTypes.length > 0) {
    for (const st of stationTypes) {
      params.append('stationTypes', st);
    }
  }
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/upcomingBookings/${clubId}?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(
      errBody,
      "GET_CLUB_BOOKING_DETAILS_BY_INTENT_ID",
      `Failed to fetch upcoming bookings for clubId: ${clubId}`
    );
  }

  return res.json();
}

export async function getDashboardStationStatusApi(
  clubId: number
): Promise<Record<number, DashboardStationBookingStatus>> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${CLUB_BOOKING_ENDPOINT}/dashboardStatus/${clubId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw handleApiError(
      errBody,
      "GET_DASHBOARD_STATION_STATUS",
      `Failed to fetch dashboard station status for clubId: ${clubId}`
    );
  }

  return res.json();
}

function convertLocalToUTCTime(localDateTime?: string): string{
  if (!localDateTime) return "";

  const date = new Date(localDateTime);
  return date.toISOString();
}