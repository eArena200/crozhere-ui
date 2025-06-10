import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStationsByClubId } from '@/api/clubApi';
import { StationDetailsResponse } from '@/api/clubApi';

interface StationState {
  stations: StationDetailsResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: StationState = {
  stations: [],
  loading: false,
  error: null,
};

export const fetchStationsByClubId = createAsyncThunk(
  'stations/fetchByClubId',
  async (clubId: number) => {
    const stations = await getStationsByClubId(clubId);
    return stations;
  }
);

const stationSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationsByClubId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationsByClubId.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStationsByClubId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stations';
      });
  },
});

export const selectStationState = (state: any) => state.stations;
export default stationSlice.reducer;
