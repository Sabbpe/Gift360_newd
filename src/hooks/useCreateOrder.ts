// hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/api/orderApi";
import type { OrderRequest, OrderResponse } from "@/types/cart";
import { AxiosError } from "axios";

export const useCreateOrder = () => {
  return useMutation<OrderResponse, AxiosError, OrderRequest>({
    mutationFn: createOrder,
  });
};
