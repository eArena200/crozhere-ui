import { fetchPlayerById, PlayerResponse, PlayerServiceException } from "@/api/playerApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export interface PlayerState {
    isLoading: boolean;
    playerId?: number;
    username?: string;
    email?: string;
    phone?: string;
    name?: string;
    error?: PlayerServiceException
}

// THUNK
export const loadPlayerById = createAsyncThunk<
PlayerResponse, number,{
    rejectValue: PlayerServiceException;
}>(
    "player/loadPlayerById",
    async(playerId, { rejectWithValue }) => {
        try {
            const response = await fetchPlayerById(playerId);
            return response;
        } catch (err: any){
            if(err.response?.data) {
                return rejectWithValue(err.response.data);
            } 
            return rejectWithValue({
                error: "PLAYER_THUNK_EXCEPTION",
                type: "LOAD_PLAYER_BY_ID",
                message: "Load player by ID failed",
                timestamp: new Date().toISOString(),
            });
        }
    }
    
);



// SLICE
const initialState: PlayerState = {
    isLoading: false
}

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadPlayerById.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(loadPlayerById.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, username, name, email, phone } = action.payload;
                state.playerId = id;
                state.username = username;
                state.name = name;
                state.email = email;
                state.phone = phone;
                state.error = undefined;
            })
            .addCase(loadPlayerById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// SELECTORS
export const selectPlayerState = (state: RootState) => state.player;

export const selectPlayerName = (state: RootState) => state.player.name;
export const selectPlayerIsLoading = (state: RootState) => state.player.isLoading;
export const selectPlayerError = (state: RootState) => state.player.error;

export default playerSlice.reducer;