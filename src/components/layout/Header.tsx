'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducer } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NAV_ITEMS } from "@/lib/types/navigation";
import { cn } from "@/lib/utils";
import LocationSelector from "@/components/LocationSelector";
import Button from "@/components/ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const LoginDialog = dynamic(() => import('@/components/LoginDialog'), { ssr: false });

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

export default function Header() {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(reducer, initialState);
  const authState = useSelector((state: RootState) => state.auth);
  const role = authState.user.role;
  const userLoggedIn = authState.loggedIn;

  const items = NAV_ITEMS.filter((item) => item.showOn.includes(role));

  return (
    <header className="w-full bg-white border-b px-4 sm:px-6 py-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/logo.png"
          alt="CrozHere Logo"
          width={32}
          height={32}
          className="rounded-sm"
          priority
        />
        <span className="text-xl font-bold text-blue-600">CrozHere</span>
      </div>

      <div className="flex items-center gap-4">
        {userLoggedIn && (
          <div className="hidden lg:flex items-center gap-4">
            {items.map((item) => (
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
        )}

        {!userLoggedIn && (
          <>
            <div className="hidden lg:block">
              <LocationSelector />
            </div>
            <Button onClick={() => dispatch({ type: 'OPEN_LOGIN' })} className="hidden lg:inline-flex">
              Login
            </Button>
          </>
        )}

        {!userLoggedIn && (
          <div className="lg:hidden">
            <LocationSelector />
          </div>
        )}
      </div>

      <LoginDialog open={state.loginOpen} onClose={() => dispatch({ type: 'CLOSE_LOGIN' })} />
    </header>
  );
}
