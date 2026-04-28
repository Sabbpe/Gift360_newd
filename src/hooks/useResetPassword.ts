import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth";
import { resetPassword } from "@/api/authApi";

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
};
