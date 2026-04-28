/** Request: POST /auth/register/send-otp */
export interface RegisterSendOtpRequest {
  mobileNumber: string;
  email: string;
}

/** Response: register send OTP */
export interface RegisterSendOtpResponse {
  success: boolean;
  message: string;
  alreadyRegistered?: boolean;
}

/** Request: POST /auth/register/verify-otp */
export interface RegisterVerifyOtpRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  otp: string;
}

/** Response: register verify OTP */
export interface RegisterVerifyOtpResponse {
  success: boolean;
  token: string | null;
  message: string;
}

/** Response: login send OTP */
export interface LoginSendOtpResponse {
  success: boolean;
  message: string;
  notRegistered?: boolean;
}
