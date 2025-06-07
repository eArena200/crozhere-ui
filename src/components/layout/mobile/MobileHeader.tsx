'use client';

import { useReducer } from "react";
import dynamic from "next/dynamic";
import LocationSelector from "@/components/ui/LocationSelector";
import CrozhereLabel from "../../ui/CrozhereLabel";

const LoginDialog = dynamic(() => import('@/components/ui/LoginDialog'), { ssr: false });

interface HeaderState {
  loginOpen: boolean;
}

type HeaderAction =
  | { type: 'OPEN_LOGIN' }
  | { type: 'CLOSE_LOGIN' };

const initialState: HeaderState = {
  loginOpen: false,
};

function reducer(state: HeaderState, action: HeaderAction): HeaderState {
  switch (action.type) {
    case 'OPEN_LOGIN':
      return { ...state, loginOpen: true };
    case 'CLOSE_LOGIN':
      return { ...state, loginOpen: false };
    default:
      return state;
  }
}

export default function MobileHeader() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-6 py-3 shadow-sm flex items-center justify-between">
      <CrozhereLabel size="md" />
      <LocationSelector />
      <LoginDialog open={state.loginOpen} onClose={() => dispatch({ type: 'CLOSE_LOGIN' })} />
    </header>
  );
}
