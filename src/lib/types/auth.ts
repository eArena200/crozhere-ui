export type UserRole = "GUEST" | "PLAYER" | "CLUB_ADMIN";

export interface AuthUser {
  id ?: number;
  role: UserRole;
  roleBasedId?: number;
}
