import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
  showOn: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", showOn: ["PLAYER", "CLUB_ADMIN"] },
  { name: "Dashboard", href: "/dashboard", showOn: ["CLUB_ADMIN"] },
  { name: "Bookings", href: "/bookings", showOn: ["PLAYER", "CLUB_ADMIN"] },
  { name: "Settings", href: "/settings", showOn: ["CLUB_ADMIN"] },
  { name: "Profile", href: "/profile", showOn: ["PLAYER", "CLUB_ADMIN"] },
];
