import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
}

export function getNavTabsForRole(role: UserRole, roleBasedId?: number) : NavItem[]{
  if (role === 'CLUB_ADMIN' && roleBasedId) {
    return [
      { name: "Home", href: `/` },
      { name: "Dashboard", href: `/admin/dashboard/` },
      { name: "Clubs", href: `/admin/clubs/` },
      { name: "Bookings", href: `/admin/bookings/` },
      { name: "Profile", href: `/admin/profile/` },
    ];
  }

  if(role === 'PLAYER' && roleBasedId){
    return [
      { name: "Home", href: `/` },
      { name: "Bookings", href: `/player/bookings/` },
      { name: "Profile", href: `/player/profile/` },
    ];
  }

  //TODO: Fix this with proper guest routes and pages
  return [
    { name: "Home", href: `/` },
    { name: "Bookings", href: `/player/bookings/` },
    { name: "Profile", href: `/player/profile/` },
  ];
}
