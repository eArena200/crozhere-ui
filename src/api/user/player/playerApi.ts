import { 
    PlayerResponse, 
    PlayerServiceException, 
    UpdatePlayerRequest 
} from "@/api/user/player/model";

const PLAYER_SERVICE_ENDPOINT = "https://api.crozhere.com/user/player";

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
    error: "PLAYER_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}


export async function fetchPlayerDetailsApi() : Promise<PlayerResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/getDetails`, {
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
    });

    if(!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "FETCH_PLAYER_DETAILS", 
            "Failed to retrieve player details")
    }

    return res.json();
}

export async function updatePlayerDetailsApi(
    updatePlayerByIdRequest: UpdatePlayerRequest
): Promise<PlayerResponse> {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/updateDetails`,{
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(updatePlayerByIdRequest)
    });

    if(!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "UPDATE_PLAYER_DETAILS", 
            "Failed to update player details")
    }

    return res.json();
}