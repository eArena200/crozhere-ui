import { ClubAdminServiceException } from "@/api/user/club-admin/model";

export interface ClubAdminState {
    isLoading: boolean;
    clubAdminId?: number;
    name?: string;
    email?: string;
    phone?: string;
    error?: ClubAdminServiceException;
}