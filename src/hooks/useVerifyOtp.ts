import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/api/otpApi";

interface VerifyOtpParams {
  reqId: string;
  otp: string;
}

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ reqId, otp }: VerifyOtpParams) => verifyOtp(reqId, otp),
  });
};
