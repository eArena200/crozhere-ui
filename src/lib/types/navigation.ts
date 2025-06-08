import { UserRole } from "./auth";

export interface NavItem {
  name: string;
  href: string;
}

export function getNavTabsForRole(role: UserRole, adminId?: number, playerId?: number) : NavItem[]{
  if (role === 'CLUB_ADMIN' && adminId) {
    return [
      { name: "Home", href: `/` },
      { name: "Dashboard", href: `/admin/${adminId}/dashboard` },
      { name: "Clubs", href: `/admin/${adminId}/clubs` },
      { name: "Profile", href: `/admin/${adminId}/profile` },
    ];
  }

  if(role === 'PLAYER' && playerId){
    return [
      { name: "Home", href: `/` },
      { name: "Bookings", href: `/player/${playerId}/bookings` },
      { name: "Profile", href: `/player/${playerId}/profile` },
    ];
  }

  return [
    { name: "Home", href: `/` },
    { name: "Bookings", href: `/player/${playerId}/bookings` },
    { name: "Profile", href: `/player/${playerId}/profile` },
  ];
}
