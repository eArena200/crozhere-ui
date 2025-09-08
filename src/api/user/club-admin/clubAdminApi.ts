import { 
    ClubAdminResponse, 
    ClubAdminServiceException, 
    UpdateClubAdminRequest
} from "@/api/user/club-admin/model";

const CLUB_ADMIN_SERVICE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/user/club-admin`;

function handleApiError(
  errorBody: any, 
  fallbackType: string, 
  fallbackMessage: string
) {
  if (errorBody && errorBody.error && errorBody.message) {
    return {
      error: errorBody.error,
      type: errorBody.type || fallbackType,
      message: errorBody.message,
      timestamp: errorBody.timestamp || new Date().toISOString(),
    };
  }
  return {
    error: "CLUB_ADMIN_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}

export async function fetchClubAdminDetailsApi(): Promise<ClubAdminResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/getDetails`,{
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
    });

    if(!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "FETCH_CLUB_ADMIN_DETAILS", 
            "Failed to retrieve clubAdmin details")
    }

    return res.json();
}

export async function updateClubAdminDetailsApi(
    updateClubAdminRequest: UpdateClubAdminRequest
): Promise<ClubAdminResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${CLUB_ADMIN_SERVICE_ENDPOINT}/updateDetails`,{
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(updateClubAdminRequest),
        
    });

    if(!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "UPDATE_CLUB_ADMIN_DETAILS", 
            "Failed to update ClubAdmin details")
    }

    return res.json();
}