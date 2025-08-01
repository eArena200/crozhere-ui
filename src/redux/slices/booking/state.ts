import { BookingIntentDetailsResponse, BookingDetailsResponse } from "@/api/booking/model";
import { StationAvailability } from "@/api/club/clubAvailabilityApi";
import { StationDetailsResponse } from "@/api/club/model";
import { PaymentResponse } from "@/api/payment/paymentApi";
import { BookingStep } from "@/lib/types/bookings";
import { PaymentMode, PaymentStatus } from "@/lib/types/payment";
import { StationType } from "@/lib/types/station";

export enum BookingSelectionMode {
    TIME,
    STATION,
}

export interface BookingTimeBasedSelectionState {
    startTime: string;
    endTime: string;
    availableStations: Record<number, StationAvailability>;
    selectedStations: Record<number, BookingStation>;
}

export interface BookingStation {
    stationId: number;
    playerCount: number;
}

export interface SearchWindow {
    windowStartTime: string;
    windowHours: number;
}

export interface BookingStationBasedSelectionState {
    selectedStations: Record<number, BookingStation>;
    bookingDuration: number;
    stationOptions: Record<number, StationDetailsResponse>;
    searchWindow: SearchWindow;
    availableSlots: string[];
    selectedSlot: string | null;
}

export interface BookingSelectionState {
    mode: BookingSelectionMode;
    supportedStationTypes: StationType[];
    selectedStationType?: StationType;
    timeBased: BookingTimeBasedSelectionState;
    stationBased: BookingStationBasedSelectionState;
    createNewBookingLoading: boolean;
    createNewBookingError?: string;
}

export interface BookingPaymentState {
    bookingIntent?: BookingIntentDetailsResponse;
    selectedPaymentMode: PaymentMode;
    paymentStatus: PaymentStatus;
    paymentError?: string;
}

export interface BookingConfirmationState {
    paymentDetails?: PaymentResponse;
    bookingDetails?: BookingDetailsResponse;
    bookingDetailsLoading: boolean;
    bookingDetailsError?: string;
}

export interface ActiveIntentsState {
    activeIntents: Record<number,BookingIntentDetailsResponse>;
    loading: boolean;
    error?: string;
}

export interface ClubStationsState {
    clubStations: Record<number,StationDetailsResponse>;
    clubStationsLoading: boolean;
    clubStationsError?: string;
}

export interface BookingPlayerState {
    playerPhoneNumber: string | null;
}

export interface ClubBookingFlowState {
    clubId: number | null;
    clubStations: ClubStationsState;
    activeIntentsState: ActiveIntentsState;
    currentStep: BookingStep;
    bookingPlayerState: BookingPlayerState;
    selectionState: BookingSelectionState;
    paymentState: BookingPaymentState;
    confirmationState: BookingConfirmationState;
}