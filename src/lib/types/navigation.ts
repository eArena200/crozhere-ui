import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
  showOn: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", showOn: ["PLAYER", "CLUB_ADMIN", "GUEST"] },
  { name: "Dashboard", href: "/dashboard", showOn: ["CLUB_ADMIN"] },
  { name: "Clubs", href: "/clubs", showOn: ["CLUB_ADMIN"] },
  { name: "Profile", href: "/profile", showOn: ["PLAYER", "CLUB_ADMIN", "GUEST"] },
];

export function getNavTabsForRole(role: UserRole) : NavItem[]{
  return NAV_ITEMS.filter((item) => item.showOn.includes(role));
}
