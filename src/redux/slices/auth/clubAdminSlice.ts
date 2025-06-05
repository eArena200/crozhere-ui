import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchClubAdminById } from "@/api/clubAdminApi";
import { ClubAdminResponse, ClubAdminServiceException } from "@/api/clubAdminApi";
import { RootState } from "@/redux/store";


export interface ClubAdminState {
    isLoading: boolean;
    clubAdminId?: number;
    name?: string;
    email?: string;
    phone?: string;
    error?: ClubAdminServiceException;
}

// THUNKS
export const loadClubAdminById = createAsyncThunk<
  ClubAdminResponse, number, {
    rejectValue: ClubAdminServiceException;
  }>(
    "clubAdmin/loadClubAdminById",
    async (clubAdminId, { rejectWithValue }) => {
        try {
            const response = await fetchClubAdminById(clubAdminId);
            return response;
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_ADMIN_THUNK_EXCEPTION",
                type: "LOAD_CLUB_ADMIN_BY_ID",
                message: "Load club-admin by ID failed",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

// SLICE
const initialState: ClubAdminState = {
    isLoading: false
}

const clubAdminSlice = createSlice({
    name: "clubAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loadClubAdminById.pending, (state) => {
          state.isLoading = true;
          state.error = undefined;
        })
        .addCase(loadClubAdminById.fulfilled, (state, action) => {
          state.isLoading = false;
          const { id, name, email, phone } = action.payload;
          state.clubAdminId = id;
          state.name = name;
          state.email = email;
          state.phone = phone;
        })
        .addCase(loadClubAdminById.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    },
});

// SELECTORS
export const selectClubAdminState = (state: RootState) => state.clubAdmin;

export const selectClubAdminName = (state: RootState) => state.clubAdmin.name;
export const selectClubAdminIsLoading = (state: RootState) => state.clubAdmin.isLoading;
export const selectClubAdminError = (state: RootState) => state.clubAdmin.error;



export default clubAdminSlice.reducer;

