import { useMutation } from "@tanstack/react-query";
import type { RegisterVerifyOtpRequest } from "@/types/otp";
import { registerVerifyOtp } from "@/api/otpApi";

export const useRegisterVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: RegisterVerifyOtpRequest) => registerVerifyOtp(data),
  });
};
