// hooks/useValidateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { validateOrderApi } from "@/api/validateOrderApi";
import type { 
  ValidateOrderRequest, 
  ValidateOrderResponse 
} from "@/types/order";

export function useValidateOrder() {
  return useMutation<ValidateOrderResponse, Error, ValidateOrderRequest>({
    mutationFn: validateOrderApi,
  });
}
