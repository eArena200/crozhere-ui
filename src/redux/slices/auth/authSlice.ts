import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  AuthServiceException, 
  VerifyAuthRequest, 
  VerifyAuthResponse 
} from '@/api/auth/model';
import {
  verifyOtpApi, 
  sendOtpApi
} from '@/api/auth/authApi';
import { loadClubAdminById } from "@/redux/slices/user/club-admin/clubAdminSlice";
import { RootState, persistor } from "@/redux/store";
import { loadPlayerById } from "@/redux/slices/user/player/playerSlice";
import { AuthState } from "@/redux/slices/auth/state";

// THUNKS
export const sendOtpAction = createAsyncThunk<
  void, string, {
    rejectValue: AuthServiceException;
  }>(
    'auth/sendOtp',
    async (phone: string, {rejectWithValue}) => {
      try{
        await sendOtpApi(phone);
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
        const verifyResponse = await verifyOtpApi(verifyAuthRequest);

        if(verifyResponse.jwt){
          localStorage.setItem("jwt", verifyResponse.jwt);
        }

        if (verifyAuthRequest.role === 'CLUB_ADMIN' && verifyResponse.roleBasedId) {
          dispatch(loadClubAdminById());
        }

        if (verifyResponse.role === 'PLAYER' && verifyResponse.roleBasedId) {
          dispatch(loadPlayerById());
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

export const logoutAction = createAsyncThunk(
  'auth/logoutAction',
  async (_, { dispatch }) => {
    localStorage.clear();
    dispatch(logout());
    await persistor.purge();
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
    logout(state: AuthState) {
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
          roleBasedId: action.payload.roleBasedId
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
export const selectAuthRoleBasedId = (state: RootState) => state.auth.user.roleBasedId;

export const { logout } = authSlice.actions;
export default authSlice.reducer;
