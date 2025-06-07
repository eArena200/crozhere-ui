'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, Calendar, Settings, User, Store } from "lucide-react";
import { getNavTabsForRole } from "@/lib/types/navigation";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/redux/slices/auth/authSlice";

const ICONS: Record<string, JSX.Element> = {
  Home: <Home size={20} />,
  Dashboard: <LayoutDashboard size={20} />,
  Clubs: <Store size={20} />,
  Bookings: <Calendar size={20} />,
  Settings: <Settings size={20} />,
  Profile: <User size={20} />,
};

export default function MobileNavBar() {
  const pathname = usePathname();
  const authState = useSelector(selectAuthState);
  const userRole = authState.user.role;
  const clubAdminId = authState.user.clubAdminId;
  const playerId = authState.user.playerId;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md flex justify-around items-center h-16 lg:hidden">
      {getNavTabsForRole(userRole, clubAdminId, playerId).map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex flex-col items-center text-sm font-medium ${
            pathname === item.href ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {ICONS[item.name]}
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
