'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducer } from "react";
import dynamic from "next/dynamic";
import { getNavTabsForRole } from "@/lib/types/navigation";
import { cn } from "@/lib/utils";
import LocationSelector from "@/components/ui/LocationSelector";
import Button from "@/components/ui/Button";
import { useSelector } from "react-redux";
import CrozhereLabel from "../../ui/CrozhereLabel";
import { selectAuthState, selectAuthUser } from "@/redux/slices/auth/authSlice";

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

export default function DesktopHeader() {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(reducer, initialState);
  const authState = useSelector(selectAuthState);
  const userLoggedIn = authState.loggedIn;
  const userRole = authState.user.role;
  const clubAdminId = authState.user.clubAdminId;
  const playerId = authState.user.playerId;

  const renderNavLinks = () => (
  <div className="flex justify-between gap-4">
    {getNavTabsForRole(userRole, clubAdminId, playerId).map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "text-sm font-medium hover:text-blue-600 transition",
          pathname === item.href ? "text-blue-600 font-semibold" : "text-gray-700"
        )}
      >
        {item.name}
      </Link>
    ))}
  </div>
);


  const renderGuestControls = () => (
    <div className="flex items-center gap-4">
      <LocationSelector />
      <Button onClick={() => dispatch({ type: 'OPEN_LOGIN' })}>
        Login/Register
      </Button>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-2 shadow-sm flex items-center justify-between">
      <CrozhereLabel size="md"/>
      <div className="flex items-center gap-4">
        {userLoggedIn ? renderNavLinks() : renderGuestControls()}
      </div>
      <LoginDialog open={state.loginOpen} onClose={() => dispatch({ type: 'CLOSE_LOGIN' })} />
    </header>
  );
}
