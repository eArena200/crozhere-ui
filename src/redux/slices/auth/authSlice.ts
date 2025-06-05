import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser } from "@/lib/types/auth";
import { AuthServiceException, VerifyAuthRequest, VerifyAuthResponse, verifyOtp, sendOtp } from '@/api/authApi';
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
export const sendOtpAction = createAsyncThunk<
  void, string, {
    rejectValue: AuthServiceException;
  }>(
    'auth/sendOtp',
    async (phone: string, {dispatch, rejectWithValue}) => {
      try{
        await sendOtp(phone);
      } catch(err: any){
        if(err.response?.data) {
          return rejectWithValue(err.response?.data)
        } 
        return rejectWithValue({
            error: "LOGIN_THUNK_EXCEPTION",
            type: "SEND_OTP",
            message: "Failed to send OTP",
            timestamp: new Date().toISOString(),
        });
      }
    }
  )

export const loginWithOtpAction = createAsyncThunk<
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
            message: "OTP verification failed",
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
      .addCase(sendOtpAction.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(sendOtpAction.fulfilled, (state, action: PayloadAction<void>) => {
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(sendOtpAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(loginWithOtpAction.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginWithOtpAction.fulfilled, (state, action: PayloadAction<VerifyAuthResponse>) => {
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
      .addCase(loginWithOtpAction.rejected, (state, action) => {
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
