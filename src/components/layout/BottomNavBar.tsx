'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, Calendar, Settings, User } from "lucide-react";
import { NAV_ITEMS, UserRole } from "@/lib/types/navigation";
import { JSX } from "react";

const ICONS: Record<string, JSX.Element> = {
  Home: <Home size={20} />,
  Dashboard: <LayoutDashboard size={20} />,
  Bookings: <Calendar size={20} />,
  Settings: <Settings size={20} />,
  Profile: <User size={20} />,
};

export default function BottomNavBar() {
  const pathname = usePathname();
  const userRole: UserRole = "PLAYER";

  const items = NAV_ITEMS.filter((item) => item.showOn.includes(userRole));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md flex justify-around items-center h-16 lg:hidden">
      {items.map((item) => (
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
