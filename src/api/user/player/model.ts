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