import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "@/redux/slices/auth/authSlice";
import clubReducer from "@/redux/slices/club/clubSlice";
import stationReducer from "@/redux/slices/club/stationSlice";
import clubAdminReducer from "@/redux/slices/auth/clubAdminSlice";
import playerReducer from "@/redux/slices/auth/playerSlice";
import clubManagementReducer from "@/redux/slices/club/clubManagementSlice";

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
  club: clubReducer,
  stations: stationReducer,
  clubManagement: clubManagementReducer,
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