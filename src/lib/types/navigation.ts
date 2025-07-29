import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
}

export function getNavTabsForRole(role: UserRole, roleBasedId?: number) : NavItem[]{
  if (role === 'CLUB_ADMIN' && roleBasedId) {
    return [
      { name: "Home", href: `/` },
      { name: "Dashboard", href: `/admin/${roleBasedId}/dashboard` },
      { name: "Clubs", href: `/admin/${roleBasedId}/clubs` },
      { name: "Bookings", href: `/admin/${roleBasedId}/bookings` },
      { name: "Profile", href: `/admin/${roleBasedId}/profile` },
    ];
  }

  if(role === 'PLAYER' && roleBasedId){
    return [
      { name: "Home", href: `/` },
      { name: "Bookings", href: `/player/${roleBasedId}/bookings` },
      { name: "Profile", href: `/player/${roleBasedId}/profile` },
    ];
  }

  //TODO: Fix this with proper guest routes and pages
  return [
    { name: "Home", href: `/` },
    { name: "Bookings", href: `/player/${roleBasedId}/bookings` },
    { name: "Profile", href: `/player/${roleBasedId}/profile` },
  ];
}
