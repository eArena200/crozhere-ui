import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
}

export const CLUB_ADMIN_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/admin/dashboard"},
  { name: "Clubs", href: "/admin/clubs"},
  { name: "Profile", href: "/admin/profile"},
];

export const PLAYER_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/"},
  { name: "Bookings", href: "/player/bookings"},
  { name: "Profile", href: "/player/profile"},
];

export const GUEST_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/"},
  { name: "Bookings", href: "/player/bookings"},
  { name: "Profile", href: "/player/profile"},
];

export function getNavTabsForRole(role: UserRole) : NavItem[]{
  if(role === 'CLUB_ADMIN'){
    return CLUB_ADMIN_NAV_ITEMS;
  }

  if(role === 'PLAYER'){
    return PLAYER_NAV_ITEMS;
  }

  return GUEST_NAV_ITEMS;
}
