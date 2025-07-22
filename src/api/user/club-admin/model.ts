export interface UpdateClubAdminRequest {
    name?: string;
    email?: string;
}

export interface ClubAdminResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface ClubAdminServiceException {
    error: string;
    type: string;
    message: string;
    timestamp: string;
}