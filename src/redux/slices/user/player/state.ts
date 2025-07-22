import { PlayerServiceException } from "@/api/user/player/model";

export interface PlayerState {
    isLoading: boolean;
    playerId?: number;
    username?: string;
    email?: string;
    phone?: string;
    name?: string;
    error?: PlayerServiceException;
}