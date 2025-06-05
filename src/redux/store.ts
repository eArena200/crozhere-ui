import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./slices/auth/authSlice";
import clubReducer from "./slices/club/clubSlice";
import clubAdminReducer from "./slices/auth/clubAdminSlice";
import playerReducer from "./slices/auth/playerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clubAdmin: clubAdminReducer,
    player: playerReducer,
    club: clubReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatchRedux = () => useDispatch<AppDispatch>();