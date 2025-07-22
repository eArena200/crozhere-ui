import { AuthServiceException } from "@/api/auth/model";
import { AuthUser } from "@/lib/types/auth";

export interface AuthState {
  isLoading: boolean;
  loggedIn: boolean;
  user: AuthUser;
  jwt?: string;
  error?: AuthServiceException;
}