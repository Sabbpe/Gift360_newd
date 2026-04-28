// hooks/useEasebuzzInitiatePayment.ts
import { useMutation } from '@tanstack/react-query';

interface InitiatePaymentResponse {
  status: boolean | number;
  data?: string;
  accessKey?: string;
  transaction_id?: string;
  merchant_order_ref?: string;
  payment_url?: string;
  gateway?: string;
  txnid?: string;
  initiation_status?: string;
  message?: string;
}

// SabbPe Wrapper API URL from environment
const SABBPE_API_URL = import.meta.env.VITE_PAYMENT_API_URL;

export function useEasebuzzInitiatePayment() {
  return useMutation({
    mutationFn: async (request: any): Promise<InitiatePaymentResponse> => {
      console.log("🌐 Calling SabbPe wrapper API:", `${SABBPE_API_URL}/initiate`);
      
      const response = await fetch(`${SABBPE_API_URL}/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to initiate payment');
      }

      return response.json();
    },
  });
}
