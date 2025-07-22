import { UserRole } from "@/lib/types/auth";

export interface VerifyAuthRequest {
  phone: string;
  otp: string;
  role: UserRole;
}

export interface VerifyAuthResponse {
  jwt: string;
  userId: number;
  roleBasedId?: number;
  role: UserRole;
}

export interface AuthServiceException {
  error: string;
  type: string;
  message: string;
  timestamp: string;
}