export type StationStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';

export enum StationType {
  PC = "PC",
  PS4 = "PS4",
  PS5 = "PS5",
  XBOX = "XBOX",
  SNOOKER = "SNOOKER",
  POOL = "POOL"
}

export const stationLogos: Record<StationType, string> = {
  SNOOKER: "/assets/snooker.png",
  POOL: "/assets/pool.png",
  PC: "/assets/pc.png",
  PS4: "/assets/ps4.png",
  PS5: "/assets/ps4.png",
  XBOX: "/assets/xbox.png",
};

export const StationTypeOptions = Object.values(StationType);


export type Station = {
  id: string;
  name: string;
  status: StationStatus;
  stationType: StationType;
};