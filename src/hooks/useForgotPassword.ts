import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "@/types/auth";
import { forgotPassword } from "@/api/authApi";

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};
