import { useMutation } from "@tanstack/react-query";
import type { ValidateTokenRequest, ValidateTokenResponse } from "@/types/auth";
import { validateResetToken } from "@/api/authApi";

export const useValidateResetToken = () => {
  return useMutation<ValidateTokenResponse, Error, ValidateTokenRequest>({
    mutationFn: validateResetToken,
  });
};
