// src/hooks/useGeneratePaymentToken.ts
import { useMutation } from "@tanstack/react-query";
import { generatePaymentToken } from "@/api/paymentApi";
import { AxiosError } from "axios";

interface TokenResponse {
  status: boolean;
  sabbpe_token?: string;
  transaction_id?: string;
  message?: string;
}

export const useGeneratePaymentToken = () => {
  return useMutation<TokenResponse, AxiosError, string>({
    mutationFn: (merchantOrderRef: string) => generatePaymentToken(merchantOrderRef),
  });
};
