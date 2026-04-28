import { useMutation } from "@tanstack/react-query";
import type { LoginResponse, ValidationError } from "@/types/auth";
import { loginWithOtp } from "@/api/authApi";
import type { LoginWithOtpRequest } from "@/types/auth";
import { AxiosError } from "axios";

/** Verify OTP and login (POST /auth/login/verify-otp). Stores JWT; redirect handled by page. */
export const useLoginWithOtp = () => {
  return useMutation<LoginResponse, AxiosError<ValidationError>, LoginWithOtpRequest>({
    mutationFn: loginWithOtp,
  });
};
