import axios from "axios";
import type { LoginResponse, LoginWithOtpRequest, LogoutRequest, ForgotPasswordRequest, ForgotPasswordResponse, ValidateTokenRequest, ValidateTokenResponse, ResetPasswordRequest, ResetPasswordResponse, SignupRequest, LoginRequest } from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL;

export const signup = async (data: SignupRequest): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, data);
    return response.data; // Returns "Signup successful"
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response.data;
};

/** Decode JWT payload for userId (clientId), phoneNumber, email. */
export function decodeJwtPayload(token: string): {
  userId?: string;
  phoneNumber?: string;
  email?: string;
} {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return {};
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>;
    return {
      userId: payload.userId as string | undefined,
      phoneNumber: payload.phoneNumber as string | undefined,
      email: payload.email as string | undefined,
    };
  } catch {
    return {};
  }
}

/** Verify OTP and login (backend: POST /auth/login/verify-otp). Returns token; userInfo derived from token. */
export const loginWithOtp = async (data: LoginWithOtpRequest): Promise<LoginResponse> => {
  const response = await axios.post<{ success: boolean; token: string | null; message: string }>(
    `${API_BASE_URL}/login/verify-otp`,
    { mobileNumber: data.mobileNumber, otp: data.otp }
  );
  const body = response.data;
  const payload = body.token ? decodeJwtPayload(body.token) : {};
  return {
    token: body.token ?? null,
    message: body.message,
    userInfo:
      body.token && payload.userId
        ? {
          name: "",
          email: payload.email ?? "",
          mobile: payload.phoneNumber ?? data.mobileNumber,
          clientId: payload.userId,
        }
        : null,
  };
};

export const logout = async (data: LogoutRequest): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/logout`, data);
  return response.data; // Returns "Logout successful"
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password`, data);
  return response.data;
};

export const validateResetToken = async (data: ValidateTokenRequest): Promise<ValidateTokenResponse> => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password/validate`, data);
  return response.data;
};

// ✅ Add reset password API
export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password/reset`, data);
  return response.data;
};