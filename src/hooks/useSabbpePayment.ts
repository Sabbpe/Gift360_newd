// src/hooks/useSabbpePayment.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generatePaymentToken, initiateSabbpePayment } from "@/api/paymentApi";
import type { SabbPeInitiateResponse } from "@/types/payment";
import { AxiosError } from "axios";

interface SabbpePaymentParams {
  amount: number;
  productinfo: string;
  frontendUrl: string;
  customer: {
    firstname: string;
    email: string;
    phone: string;
  };
  merchantOrderRef?: string;
}

interface SabbpePaymentResult {
  mutate: (params: SabbpePaymentParams) => void;
  mutateAsync: (params: SabbpePaymentParams) => Promise<SabbPeInitiateResponse>;
  data: SabbPeInitiateResponse | undefined;
  isPending: boolean;
  isError: boolean;
  error: AxiosError | null;
  reset: () => void;
}

/**
 * Custom hook for Sabbpe payment flow
 * 
 * Flow:
 * 1. Generate Sabbpe token using generatePaymentToken
 * 2. Use that token to initiate payment with the exact payload:
 *    {
 *      "sabbpe_token": "<token>",
 *      "productinfo": "Test Payment",
 *      "amount": 58,
 *      "frontend_url": "https://giftvouchersuat.sabbpe.com",
 *      "customer": {
 *        "firstname": "Test",
 *        "email": "contact@sabbpe.com",
 *        "phone": "9876543210"
 *      }
 *    }
 */
export const useSabbpePayment = (): SabbpePaymentResult => {
  const [paymentData, setPaymentData] = useState<SabbPeInitiateResponse | undefined>();

  const tokenMutation = useMutation({
    mutationFn: async (merchantOrderRef: string | undefined) => {
      // Generate unique merchant order ref if not provided
      const orderRef = merchantOrderRef || `MOR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Step 1: Generate the Sabbpe token
      const tokenResponse = await generatePaymentToken(orderRef);
      console.log("🔑 Generated Sabbpe token:", tokenResponse);
      
      if (!tokenResponse.sabbpe_token) {
        throw new Error(tokenResponse.message || "Failed to generate token");
      }
      
      return tokenResponse.sabbpe_token;
    },
  });

  const initiateMutation = useMutation({
    mutationFn: async (params: SabbpePaymentParams) => {
      // Get the token from the token mutation state or generate a new one
      let token = tokenMutation.data;
      
      if (!token) {
        // Generate a new token if not already generated - use unique order ref
        const orderRef = params.merchantOrderRef || `MOR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const tokenResponse = await generatePaymentToken(orderRef);
        if (!tokenResponse.sabbpe_token) {
          throw new Error(tokenResponse.message || "Failed to generate token");
        }
        token = tokenResponse.sabbpe_token;
      }

      console.log("💳 Using Sabbpe token for payment:", token);

      // Step 2: Initiate payment with the exact payload structure
      const response = await initiateSabbpePayment(
        token,
        params.amount,
        params.productinfo,
        params.frontendUrl,
        params.customer
      );

      return response;
    },
    onSuccess: (data) => {
      setPaymentData(data);
    },
  });

  return {
    mutate: initiateMutation.mutate,
    mutateAsync: initiateMutation.mutateAsync,
    data: paymentData || initiateMutation.data,
    isPending: tokenMutation.isPending || initiateMutation.isPending,
    isError: tokenMutation.isError || initiateMutation.isError,
    error: (tokenMutation.error || initiateMutation.error) as AxiosError | null,
    reset: () => {
      tokenMutation.reset();
      initiateMutation.reset();
      setPaymentData(undefined);
    },
  };
};
