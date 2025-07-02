import { PaymentMode, PaymentStatus } from "@/lib/types/payment";


const CMS_ENDPOINT = "http://localhost:8080";

export interface InitPaymentRequest {
    intentId: number;
    amount: number;
    paymentMode: PaymentMode;
}

export interface PaymentResponse {
    paymentId: number;
    intentId: number;
    amount: number;
    paymentMode: PaymentMode;
    status: PaymentStatus;
}


function handleApiError(errorBody: any, fallbackType: string, fallbackMessage: string) {
  if (errorBody && errorBody.error && errorBody.message) {
    return {
      error: errorBody.error,
      type: errorBody.type || fallbackType,
      message: errorBody.message,
      timestamp: errorBody.timestamp || new Date().toISOString(),
    };
  }
  return {
    error: "PAYMENT_API_ERROR",
    type: fallbackType,
    message: fallbackMessage,
    timestamp: new Date().toISOString(),
  };
}

export async function initPaymentApi(request:InitPaymentRequest): Promise<PaymentResponse> {
    const res = await fetch(`${CMS_ENDPOINT}/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "INIT_PAYMENT", 
            `Failed to initiate payment`);
    }

    return res.json();
}

export async function getPaymentDetailsApi(paymentId: number): Promise<PaymentResponse> {
    const res = await fetch(`${CMS_ENDPOINT}/payment/${paymentId}`);

    if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw handleApiError(errBody, "GET_PAYMENT_DETAILS", 
            `Failed to get payment details for paymentId: ${paymentId}`);
    }

    return res.json();
}