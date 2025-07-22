import { 
  VerifyAuthRequest, 
  VerifyAuthResponse 
} from "@/api/auth/model";

const AUTH_ENDPOINT = "http://localhost:8080/auth";

export async function sendOtpApi(
  phone: string
) {
  try {
    const res = await fetch(`${AUTH_ENDPOINT}/init`, {
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

export async function verifyOtpApi(
  verifyAuthRequest: VerifyAuthRequest
):Promise<VerifyAuthResponse> {
    const res = await fetch(`${AUTH_ENDPOINT}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyAuthRequest),
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
