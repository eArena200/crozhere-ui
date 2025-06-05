import { timeStamp } from "console";

const PLAYER_SERVICE_ENDPOINT = "http://localhost:8080/players"

export interface UpdatePlayerRequest {
    username: string;
    name: string;
    email: string;
}

export interface PlayerResponse {
    id: number;
    username: string;
    email: string;
    phone: string;
    name: string;
}

export interface PlayerServiceException {
    error: string;
    type: string;
    message: string;
    timestamp: string;
}

export async function fetchPlayerById(playerId: number) : Promise<PlayerResponse> {
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/${playerId}`);

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
            message: `Failed to fetch player with id: ${playerId}`,
            timeStamp: new Date().toISOString()
        }
    }

    return res.json();
}


export async function updatePlayerById(
    playerId: number,
    updatePlayerByIdRequest: UpdatePlayerRequest
): Promise<PlayerResponse> {
    const res = await fetch(`${PLAYER_SERVICE_ENDPOINT}/${playerId}`,{
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
            message: `Failed to fetch player with id: ${playerId}`,
            timeStamp: new Date().toISOString()
        }
    }

    return res.json();
}