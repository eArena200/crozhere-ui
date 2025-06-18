export enum ChargeType {
    BASE = "BASE",
    NIGHT = "NIGHT",
    ADDON = "ADDON"
}
export const ChargeTypeOptions = Object.values(ChargeType);

export enum ChargeUnit {
    PER_HOUR = "PER_HOUR",
    PER_PLAYER_PER_HOUR = "PER_PLAYER_PER_HOUR"
}
export const ChargeUnitOptions = Object.values(ChargeUnit);