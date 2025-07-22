"use client";
import { useReducer } from "react";
import { useDispatchRedux } from "@/redux/store";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { loginWithOtpAction, selectAuthIsLoading, sendOtpAction } from "@/redux/slices/auth/authSlice";
import { useSelector } from "react-redux";
import { VerifyAuthRequest } from "@/api/auth/model";

type LoginOrRegisterRole = "PLAYER" | "CLUB_ADMIN";

interface LoginState {
  loginAs: LoginOrRegisterRole;
  phone: string;
  otp: string;
  otpSent: boolean;
  error: string;
}

type LoginAction =
  | { type: "SET_LOGIN_AS"; payload: LoginOrRegisterRole }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_OTP"; payload: string }
  | { type: "SET_OTP_SENT"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

const initialState: LoginState = {
  loginAs: "PLAYER",
  phone: "",
  otp: "",
  otpSent: false,
  error: "",
};

function reducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_LOGIN_AS": return { ...state, loginAs: action.payload };
    case "SET_PHONE": return { ...state, phone: action.payload };
    case "SET_OTP": return { ...state, otp: action.payload };
    case "SET_OTP_SENT": return { ...state, otpSent: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "RESET": return initialState;
    default: return state;
  }
}

export interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  
  const PHONE_REGEX = /^\d{10}$/
  const [state, dispatch] = useReducer(reducer, initialState);

  const router = useRouter();
  const dispatchRedux = useDispatchRedux();
  const isLoading = useSelector(selectAuthIsLoading);

  const handleSendOtp = async () => {
    dispatch({ type: "SET_ERROR", payload: "" });
    if (!PHONE_REGEX.test(state.phone)) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a valid 10-digit phone number" });
      return;
    }

    try {
      const res = await dispatchRedux(sendOtpAction(state.phone));
      if (sendOtpAction.fulfilled.match(res)){
        dispatch({ type: "SET_OTP_SENT", payload: true });
      } else {
        const errorPayload = res.payload || "Failed to send OTP";
        dispatch({ type: "SET_ERROR", payload: typeof errorPayload === 'string' ? errorPayload : errorPayload.message || "Failed to send OTP" });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to send OTP" });
    }
  };

  const handleVerifyOtp = async () => {
    dispatch({ type: "SET_ERROR", payload: "" });

    if (state.otp.length !== 6) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a 6-digit OTP" });
      return;
    }

    const verifyAuthRequest: VerifyAuthRequest = {
      phone: state.phone,
      otp: state.otp,
      role: state.loginAs
    };

    try {
      const resultAction = await dispatchRedux(loginWithOtpAction(verifyAuthRequest));
      
      if (loginWithOtpAction.fulfilled.match(resultAction)) {
        router.push("/");
        onClose();
        dispatch({ type: "RESET" });
      } else {
        const errorPayload = resultAction.payload || "Invalid OTP";
        dispatch({ type: "SET_ERROR", payload: typeof errorPayload === 'string' ? errorPayload : errorPayload.message || "Login failed" });
      }
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "An unexpected error occurred" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex justify-between border-b">
          <Button
            variant={state.loginAs === "PLAYER" ? "primary" : "secondary"}
            onClick={() => dispatch({ type: "SET_LOGIN_AS", payload: "PLAYER" })}
            className="flex-1 rounded-none"
          >
            Player
          </Button>
          <Button
            variant={state.loginAs === "CLUB_ADMIN" ? "primary" : "secondary"}
            onClick={() => dispatch({ type: "SET_LOGIN_AS", payload: "CLUB_ADMIN" })}
            className="flex-1 rounded-none"
          >
            Partner
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Login or Register
        </h2>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded mb-2 focus:outline-none text-gray-700"
              value={state.phone}
              onChange={(e) => dispatch({ type: "SET_PHONE", payload: e.target.value.replace(/[^\d]/g, '') })}
              maxLength={10}
              disabled={state.otpSent}
            />
            {state.otpSent && (
              <Button
                type="button"
                variant="link"
                className="text-blue-600 hover:underline text-sm mb-2 px-2 py-1"
                onClick={() => {
                  dispatch({ type: "SET_OTP_SENT", payload: false });
                  dispatch({ type: "SET_OTP", payload: "" });
                  dispatch({ type: "SET_ERROR", payload: "" });
                }}
              >
                Change
              </Button>
            )}
          </div>

          <Button
            onClick={handleSendOtp}
            disabled={isLoading || state.otpSent}
            className="w-full mb-2"
          >
            {'Send OTP'}
          </Button>
        </div>

        {state.otpSent && (
          <div className="mb-4 text-gray-900">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded mb-2 focus:outline-none"
              value={state.otp}
              onChange={(e) => dispatch({ type: "SET_OTP", payload: e.target.value.replace(/[^\d]/g, '') })}
              maxLength={6}
            />
            <Button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              variant="primary"
              className="w-full mb-2 bg-green-600 hover:bg-green-700"
            >
              {'Verify OTP'}
            </Button>
          </div>
        )}

        { state.error && 
          <div className="text-red-500 text-sm mb-2 text-center">
            {state.error}
          </div>
        }
      </div>
    </div>
  );
}
