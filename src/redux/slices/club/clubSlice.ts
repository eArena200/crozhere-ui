import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ClubResponse, getClubsForAdminId } from "@/api/clubApi";
import { RootState } from "@/redux/store";

export interface ClubState {
  clubs: ClubResponse[];
  loading: boolean;
  error?: string;
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

const clubSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchClubsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(fetchClubsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const selectClubState = (state: RootState) => state.club;

export default clubSlice.reducer;
