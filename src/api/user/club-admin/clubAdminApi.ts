import { 
    ClubAdminResponse, 
    ClubAdminServiceException, 
    UpdateClubAdminRequest
} from "@/api/user/club-admin/model";

const CLUB_ADMIN_SERVICE_ENDPOINT = "http://localhost:8080/user/club-admin"

export async function fetchClubAdminDetailsApi(): Promise<ClubAdminResponse> {
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/getDetails`);

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
            message: `Failed to fetch club admin details`,
            timestamp: new Date().toISOString(),
        };
    }

    return res.json();
}

export async function updateClubAdminDetailsApi(
    updateClubAdminRequest: UpdateClubAdminRequest
): Promise<ClubAdminResponse> {
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/updateDetails`,{
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
            message: `Failed to update club admin details`,
            timestamp: new Date().toISOString(),
        };
    }

    return res.json();
}