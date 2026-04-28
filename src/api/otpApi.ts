import axios from "axios";
import type {
  RegisterSendOtpRequest,
  RegisterSendOtpResponse,
  RegisterVerifyOtpRequest,
  RegisterVerifyOtpResponse,
  LoginSendOtpResponse,
} from "@/types/otp";

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL;

/** POST /auth/register/send-otp */
export const registerSendOtp = async (
  params: RegisterSendOtpRequest
): Promise<RegisterSendOtpResponse> => {
  const { data } = await axios.post<RegisterSendOtpResponse>(
    `${API_BASE_URL}/register/send-otp`,
    { mobileNumber: params.mobileNumber, email: params.email }
  );
  return data;
};

/** POST /auth/register/verify-otp */
export const registerVerifyOtp = async (
  params: RegisterVerifyOtpRequest
): Promise<RegisterVerifyOtpResponse> => {
  const { data } = await axios.post<RegisterVerifyOtpResponse>(
    `${API_BASE_URL}/register/verify-otp`,
    {
      fullName: params.fullName,
      email: params.email,
      mobileNumber: params.mobileNumber,
      otp: params.otp,
    }
  );
  return data;
};

/** POST /auth/login/send-otp */
export const sendLoginOtp = async (params: { mobileNumber: string; email?: string }): Promise<LoginSendOtpResponse> => {
  const { data } = await axios.post<LoginSendOtpResponse>(
    `${API_BASE_URL}/login/send-otp`,
    params
  );
  return data;
};
