export type StationStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';

export enum StationType {
  PC = "PC",
  PS4 = "PS4",
  XBOX = "XBOX",
  SNOOKER = "SNOOKER",
  POOL = "POOL"
}

export const StationTypeOptions = Object.values(StationType);


export type Station = {
  id: string;
  name: string;
  status: StationStatus;
  stationType: StationType;
};