import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VerifyAuthResponse } from "@/api/authApi";
import { AuthUser } from "@/lib/types/auth";

export interface AuthState {
  loggedIn: boolean;
  user: AuthUser;
  jwt?: string;
}

const initialState: AuthState = {
  loggedIn: false,
  user: {
    role: "GUEST"
  },
  jwt: '',
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
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;
