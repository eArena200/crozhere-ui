import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser } from "@/lib/types/auth";
import { AuthServiceException, VerifyAuthRequest, VerifyAuthResponse, verifyOtp } from '@/api/authApi';
import { loadClubAdminById } from "./clubAdminSlice";
import { RootState } from "@/redux/store";
import { loadPlayerById } from "./playerSlice";

export interface AuthState {
  isLoading: boolean;
  loggedIn: boolean;
  user: AuthUser;
  jwt?: string;
  error?: AuthServiceException;
}

// THUNKS
export const loginWithOtp = createAsyncThunk<
  VerifyAuthResponse, VerifyAuthRequest, {
   rejectValue: AuthServiceException; 
  }>(
    'auth/loginWithOtp',
    async (verifyAuthRequest: VerifyAuthRequest, { dispatch, rejectWithValue }) => {
      try {
        const verifyResponse = await verifyOtp(verifyAuthRequest);

        if (verifyAuthRequest.role === 'CLUB_ADMIN' && verifyResponse.clubAdminId) {
          dispatch(loadClubAdminById(verifyResponse.clubAdminId));
        }

        if (verifyResponse.role === 'PLAYER' && verifyResponse.playerId) {
          dispatch(loadPlayerById(verifyResponse.playerId));
        }

        return verifyResponse;
      } catch (err: any) {
        if(err.response?.data) {
          return rejectWithValue(err.response?.data)
        } 
        return rejectWithValue({
            error: "LOGIN_THUNK_EXCEPTION",
            type: "LOAD_BY_OTP",
            message: "login with otp failed",
            timestamp: new Date().toISOString(),
        });
      }
    }
);


// SLICE
const initialState: AuthState = {
  isLoading: false,
  loggedIn: false,
  user: {
    role: "GUEST",
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction(state: AuthState, 
      action: PayloadAction<VerifyAuthResponse>) {
      const payload = action.payload;
      
      state.loggedIn = true;
      state.jwt = payload.jwt;
      state.user = {
        id: payload.userId,
        role: payload.role,
        playerId: payload.playerId,
        clubAdminId: payload.clubAdminId
      };
    },

    logoutAction(state: AuthState) {
      state.loggedIn = false;
      state.jwt = '';
      state.user = {
        role: "GUEST"
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithOtp.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginWithOtp.fulfilled, (state, action: PayloadAction<VerifyAuthResponse>) => {
        state.isLoading = false;
        state.loggedIn = true;
        state.jwt = action.payload.jwt;
        state.user = {
          id: action.payload.userId,
          role: action.payload.role,
          playerId: action.payload.playerId,
          clubAdminId: action.payload.clubAdminId,
        };
        state.error = undefined;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


// SELECTORS
export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectIsUserLoggedIn = (state: RootState) => state.auth.loggedIn;



export const { logoutAction } = authSlice.actions;
export default authSlice.reducer;
