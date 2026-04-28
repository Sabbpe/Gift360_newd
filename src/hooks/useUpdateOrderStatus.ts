import { useMutation } from "@tanstack/react-query";
import { updateOrderStatus } from "@/api/orderApi";
import { AxiosError } from "axios";

interface UpdateOrderStatusParams {
  orderNumber: string;
  status: "PAID" | "FAILED";
}

export const useUpdateOrderStatus = () => {
  return useMutation<string, AxiosError, UpdateOrderStatusParams>({
    mutationFn: ({ orderNumber, status }) => 
      updateOrderStatus(orderNumber, status),
  });
};
