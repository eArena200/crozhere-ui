import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "@/redux/slices/auth/authSlice";
import clubAdminReducer from "@/redux/slices/user/club-admin/clubAdminSlice";
import playerReducer from "@/redux/slices/user/player/playerSlice";
import clubManagementReducer from "@/redux/slices/club/management/clubManagementSlice";
import clubBookingReducer from "@/redux/slices/booking/bookingSlice";
import clubDashboardReducer from "@/redux/slices/club/dashboard/clubDashboardSlice";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';


const rootReducer = combineReducers({
  auth: authReducer,
  clubAdmin: clubAdminReducer,
  player: playerReducer,
  clubManagement: clubManagementReducer,
  clubBooking: clubBookingReducer,
  clubDashboard: clubDashboardReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatchRedux = () => useDispatch<AppDispatch>();