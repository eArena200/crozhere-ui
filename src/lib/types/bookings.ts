import { StationType } from "@/lib/types/station";

export enum BookingStep {
    SELECTION = "SELECTION",
    PAYMENT = "PAYMENT",
    COMMIT = "COMMIT"
}

export const BookingSteps = Object.values(BookingStep);

export enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export const BookingStatusOptions = Object.values(BookingStatus);

export enum BookingType {
    GRP = "GRP",
    IND = "IND"
}

export const BookingTypeOptions = Object.values(BookingType);

export interface BookingsFilters {
    fromDateTime: string;
    toDateTime: string;
    stationTypes: StationType[];
    bookingStatuses: BookingStatus[];
    bookingTypes: BookingType[];
}

export interface BookingsSort {
    sortBy: string;
    sortOrder: "ASC" | "DESC";
}

export interface BookingsSearch {
    searchText: string;
}

export interface BookingsPagination {
    page: number;
    pageSize: number;
    totalPages: number;
}

export enum BookingsColumn {
    PLAYER_ID,
    PLAYER_NAME,
    PLAYER_PHONE_NUMBER,
    START_TIME,
    END_TIME,
    PLAYER_COUNT,
    STATIONS,
    STATION_TYPE,
    BOOKING_AMOUNT 
}