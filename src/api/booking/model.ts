import { BookingStatus } from "@/lib/types/bookings";
import { StationType } from "@/lib/types/station";


// REQUEST MODEL
export interface CreateClubBookingIntentRequest {
    clubId: number;
    playerPhoneNumber: string;
    stationType: StationType;
    stations: BookingStationRequest[];
    startTime: string;
    endTime: string;
}

export interface CreatePlayerBookingIntentRequest {
    clubId: number;
    playerId: number;
    stationType: StationType;
    stations: BookingStationRequest[];
    startTime: string;
    endTime: string;
}

export interface BookingStationRequest {
    stationId: number;
    playerCount: number;
}

// RESPONSE MODEL
export interface BookingIntentDetailsResponse {
    intentId: number;
    club: BookingIntentClubDetails;
    player: BookingIntentPlayerDetails;
    intent: BookingIntentDetails;
}

export interface BookingDetailsResponse {
    bookingId: number;
    club: BookingClubDetails;
    player: BookingPlayerDetails;
    booking: BookingDetails;
}

// MODELS
export interface BookingIntentClubDetails {
    clubId: number;
    clubName: string;
}

export interface BookingIntentPlayerDetails {
    playerId: number;
    playerPhoneNumber: string;
    name: string;
}

export interface BookingIntentDetails {
    startTime: string;
    endTime: string;
    expiresAt: string;
    stationType: StationType;
    stations: BookingIntentStationDetails[];
    totalPlayerCount: number;
    isCancelled: boolean;
    isConfirmed: boolean;
    costDetails: BookingIntentCostDetails;
}

export interface BookingIntentStationDetails {
    stationId: number;
    stationName: string;
    playerCount: number;
}

export interface BookingIntentCostDetails {
    totalCost: number;
}

export interface BookingClubDetails {
    clubId: number;
    clubName: string;
}

export interface BookingPlayerDetails {
    playerId: number;
    playerPhoneNumber: string;
    name: string;
}

export interface BookingDetails {
    startTime: string;
    endTime: string;
    totalPlayers: number;
    stationType: StationType;
    stations: BookingStationDetails[];
    bookingStatus: BookingStatus;
    costDetails: BookingCostDetails;
}

export interface BookingStationDetails {
    stationId: number;
    stationName: string;
    playerCount: number;
}

export interface BookingCostDetails {
    totalCost: number;
}

export interface DashboardStationBookingStatus {
    currentBooking: BookingDetailsResponse;
    nextBooking: BookingDetailsResponse;
}

export interface BookingsPagenatedListResponse {
    bookings: BookingDetailsResponse[];
    totalCount: number;
}

export interface BookingServiceException {
  error: string;
  type: string;
  message: string;
  timestamp: string;
}