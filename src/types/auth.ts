export interface SignupRequest {
  name: string;
  mobile: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
}

export interface LoginWithOtpRequest {
  mobileNumber: string;
  otp: string;
  email?: string; // ADD THIS
}

export interface LoginResponse {
  token: string | null;
  message: string;
  userInfo:{
    name: string;
    email: string;
    mobile: string;
    clientId: string;
  } | null;
}

export interface LogoutRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token: string | null;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  status: "VALID" | "INVALID_TOKEN" | "EXPIRED" | "ALREADY_USED" | "TOO_SOON";
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface AuthUser {
  name: string;
  email: string;
  mobile: string;
  token: string;
  clientId: string;
}

export interface ValidationError {
  [field: string]: string;
}
