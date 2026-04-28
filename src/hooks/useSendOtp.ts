import { useMutation } from "@tanstack/react-query";
import { sendLoginOtp } from "@/api/otpApi";
import type { LoginSendOtpResponse } from "@/types/otp";
import { AxiosError } from "axios";

/** Send OTP for login (POST /auth/login/send-otp). */
export const useSendOtp = () => {
  return useMutation<LoginSendOtpResponse, AxiosError, { mobileNumber: string; email?: string }>({
    mutationFn: (params) => sendLoginOtp(params),
  });
};
