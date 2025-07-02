import { StationType } from "./station";

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

export interface BookingsPagination {
    page: number;
    pageSize: number;
}