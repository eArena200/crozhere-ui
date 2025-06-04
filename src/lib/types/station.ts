export type StationType = "SNOOKER" | "POOL" | "PC" | "PS4" | "XBOX";
export type StationStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';


export type Station = {
  id: string;
  name: string;
  status: StationStatus;
  stationType: StationType;
};