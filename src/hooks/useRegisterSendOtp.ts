import { useMutation } from "@tanstack/react-query";
import type { RegisterSendOtpRequest } from "@/types/otp";
import { registerSendOtp } from "@/api/otpApi";

export const useRegisterSendOtp = () => {
  return useMutation({
    mutationFn: (params: RegisterSendOtpRequest) => registerSendOtp(params),
  });
};
