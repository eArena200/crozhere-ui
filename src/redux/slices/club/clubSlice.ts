import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ClubResponse, getClubsForAdminId } from "@/api/clubManagementApi";
import { RootState } from "@/redux/store";

export interface ClubState {
  clubs: ClubResponse[];
  loading: boolean;
  error?: string;
  selectedClubId?: number;
}

const initialState: ClubState = {
  clubs: [],
  loading: false,
};

export const fetchClubsForAdmin = createAsyncThunk<
  ClubResponse[],
  number,
  { rejectValue: string }
>("clubs/fetchForAdmin", async (adminId, { rejectWithValue }) => {
  try {
    return await getClubsForAdminId(adminId);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch clubs");
  }
});

export const fetchClubById = createAsyncThunk<
  ClubResponse,
  number,
  { rejectValue: string }
>("clubs/fetchById", async (clubId, { rejectWithValue }) => {
  try {
    // Assuming there's an API function to fetch a club by ID
    const response = await fetch(`/api/clubs/${clubId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch club");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch club");
  }
});

const clubSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    setSelectedClub: (state, action: PayloadAction<number | undefined>) => {
      state.selectedClubId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchClubsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
        // Set the first club as selected if none is selected
        if (!state.selectedClubId && action.payload.length > 0) {
          state.selectedClubId = action.payload[0].clubId;
        }
      })
      .addCase(fetchClubsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = state.clubs.map(club => 
          club.clubId === action.payload.clubId ? action.payload : club
        );
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { setSelectedClub } = clubSlice.actions;
export const selectClubState = (state: RootState) => state.club;
export const selectSelectedClub = (state: RootState) => 
  state.club.clubs.find(club => club.clubId === state.club.selectedClubId);

export default clubSlice.reducer;
