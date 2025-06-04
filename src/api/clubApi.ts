import { StationType } from "@/lib/types/station";

const CLUBSERVICE_ENDPOINT = "http://localhost:8080";

export interface CreateClubRequest {
  name: string;
  clubAdminId: number;
}

export interface UpdateClubRequest {
  name: string;
}

export interface ClubResponse {
  clubId: number;
  clubAdminId: number;
  clubLayoutId: string;
  name: string;
}

export interface AddStationRequest {
  clubId: number;
  stationName: string;
  stationType: StationType;
  stationGroupLayoutId: string;
}

export interface UpdateStationRequest {
  stationName: string;
}

export interface StationResponse {
  stationId: number;
  clubId: number;
  stationName: string;
  stationType: StationType;
  stationGroupLayoutId: string;
  stationLayoutId: string;
  isActive: boolean;
}


// Club APIs
export async function createClub(data: CreateClubRequest): Promise<ClubResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create club");
    }

    return res.json();
}

export async function getAllClubs(clubAdminId?: number): Promise<ClubResponse[]> {
    const url = new URL(`${CLUBSERVICE_ENDPOINT}/clubs`);
    if (clubAdminId) {
        url.searchParams.append("clubAdminId", clubAdminId.toString());
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error("Failed to fetch clubs");
    }

    return res.json();
}

export async function getClubById(clubId: number): Promise<ClubResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`);
    if (!res.ok) throw new Error("Failed to get club");
    return res.json();
}

export async function updateClub(clubId: number, data: UpdateClubRequest): Promise<ClubResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update club");
    }

    return res.json();
}

export async function deleteClub(clubId: number): Promise<void> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/${clubId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete club");
    }
}

// Station APIs
export async function addStation(data: AddStationRequest): Promise<StationResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add station");
    }

    return res.json();
}

export async function getStationById(stationId: number): Promise<StationResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`);
    if (!res.ok) throw new Error("Failed to get station");
    return res.json();
}

export async function updateStation(
    stationId: number,
    data: UpdateStationRequest
): Promise<StationResponse> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update station");
    }

    return res.json();
}

export async function deleteStation(stationId: number): Promise<void> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations/${stationId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete station");
    }
}

export async function getStationsByClubId(clubId: number): Promise<StationResponse[]> {
    const res = await fetch(`${CLUBSERVICE_ENDPOINT}/clubs/stations?clubId=${clubId}`);
    if (!res.ok) throw new Error("Failed to fetch stations");
    return res.json();
}
