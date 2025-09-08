export enum ChargeType {
    REGULAR = "REGULAR",
    ADDON = "ADDON"
}
export const ChargeTypeOptions = Object.values(ChargeType);

export enum ChargeUnit {
    PER_HOUR = "PER_HOUR",
    PER_PLAYER_PER_HOUR = "PER_PLAYER_HOUR"
}
export const ChargeUnitOptions = Object.values(ChargeUnit);

export enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export const DaysOfWeek = Object.values(DayOfWeek);