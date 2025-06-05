
const CLUB_ADMIN_SERVICE_ENDPOINT = "http://localhost:8080/club-admins"

export interface UpdateClubAdminRequest {
    name?: string;
    email?: string;
}

export interface ClubAdminResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface ClubAdminServiceException {
    error: string;
    type: string;
    message: string;
    timestamp: string;
}

export async function fetchClubAdminById(clubAdminId: number): Promise<ClubAdminResponse> {
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/${clubAdminId}`);

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);

        if (errorBody && errorBody.error && errorBody.message) {
            const clubAdminServiceException: ClubAdminServiceException = {
                error: errorBody.error,
                type: errorBody.type,
                message: errorBody.message,
                timestamp: errorBody.timestamp,
            };
            throw clubAdminServiceException;
        }

        throw {
            error: "CLUB_ADMIN_API_ERROR",
            type: "FETCH_CLUB_ADMIN_BY_ID",
            message: `Failed to fetch club admin with id: ${clubAdminId}`,
            timestamp: new Date().toISOString(),
        };
    }

    return res.json();
}

export async function updateClubAdminById(
    clubAdminId: number,
    updateClubAdminRequest: UpdateClubAdminRequest
): Promise<ClubAdminResponse> {
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/${clubAdminId}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(updateClubAdminRequest)
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);

        if (errorBody && errorBody.error && errorBody.message) {
            const clubAdminServiceException: ClubAdminServiceException = {
                error: errorBody.error,
                type: errorBody.type,
                message: errorBody.message,
                timestamp: errorBody.timestamp,
            };
            throw clubAdminServiceException;
        }

        throw {
            error: "CLUB_ADMIN_API_ERROR",
            type: "UPDATE_CLUB_ADMIN",
            message: `Failed to fetch club admin with id: ${clubAdminId}`,
            timestamp: new Date().toISOString(),
        };
    }

    return res.json();
}