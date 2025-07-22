import { 
    PlayerResponse, 
    PlayerServiceException, 
    UpdatePlayerRequest 
} from "@/api/user/player/model";

const PLAYER_SERVICE_ENDPOINT = "http://localhost:8080/user/player"

export async function fetchPlayerDetailsApi() : Promise<PlayerResponse> {
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/getDetails`);

    if(!res.ok){
        const errorBody = await res.json().catch(() => null);

        if(errorBody && errorBody.error && errorBody.message){
            const playerServiceException: PlayerServiceException = {
                error: errorBody.error,
                type: errorBody.type,
                message: errorBody.message,
                timestamp: errorBody.timestamp
            };

            throw playerServiceException;
        }

        throw {
            error: "PLAYER_API_ERROR",
            type: "FETCH_PLAYER_BY_ID",
            message: `Failed to fetch player`,
            timeStamp: new Date().toISOString()
        }
    }

    return res.json();
}

export async function updatePlayerDetailsApi(
    updatePlayerByIdRequest: UpdatePlayerRequest
): Promise<PlayerResponse> {
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/updateDetails`,{
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(updatePlayerByIdRequest)
    });

    if(!res.ok){
        const errorBody = await res.json().catch(() => null);

        if(errorBody && errorBody.error && errorBody.message){
            const playerServiceException: PlayerServiceException = {
                error: errorBody.error,
                type: errorBody.type,
                message: errorBody.message,
                timestamp: errorBody.timestamp
            };

            throw playerServiceException;
        }

        throw {
            error: "PLAYER_API_ERROR",
            type: "UPDATE_PLAYER",
            message: `Failed to update player details`,
            timeStamp: new Date().toISOString()
        }
    }

    return res.json();
}