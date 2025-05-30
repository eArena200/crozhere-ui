import { UserRole } from "@/lib/types/auth";

export interface VerifyAuthResponse {
  jwt: string;
  userId: number;
  playerId?: number;
  clubAdminId?: number;
  role: UserRole;
}

const INIT_AUTH_ENDPOINT = "http://localhost:8080/auth/init";
const VERIFY_AUTH_ENDPOINT = "http://localhost:8080/auth/verify"

export async function sendOtp(phone: string) {
  try {
    const res = await fetch(INIT_AUTH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const contentType = res.headers.get("content-type");
    let result = null;

    if (contentType?.includes("application/json")) {
      result = await res.json();
    } else {
      const text = await res.text();
      result = text || null;
    }

    if (!res.ok) {
      console.error("sendOtp failed:", result);
      throw new Error(result?.message || "Failed to send OTP");
    }

    return result;
  } catch (err) {
    console.error("sendOtp error:", err);
    throw err;
  }
}


export async function verifyOtp(phone: string, otp: string, role: UserRole): Promise<VerifyAuthResponse> {
  const res = await fetch(VERIFY_AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp, role}),
  });

  const contentType = res.headers.get("content-type");
  let result: any;

  if (contentType?.includes("application/json")) {
    result = await res.json();
  } else {
    const text = await res.text();
    result = text || null;
  }

  if (!res.ok) {
    throw new Error(result?.message || "Invalid OTP");
  }

  return result;
}
