// api/validateOrderApi.ts
import { ordersApiClient } from "@/lib/valuedesignApi";
import { AxiosError } from "axios";
import type { 
  ValidateOrderRequest, 
  ValidateOrderResponse 
} from "@/types/order";

export async function validateOrderApi(
  request: ValidateOrderRequest
): Promise<ValidateOrderResponse> {
  const { orderNumber, ...body } = request;

  try {
    const response = await ordersApiClient.post<ValidateOrderResponse>(
      `/v1/orders/validate/${orderNumber}`, // ✅ /api + /v1/orders/validate = correct path
      body
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    
    if (error.response?.status === 401) {
      throw new Error("Please login to continue");
    }

    const errorMessage = 
      error.response?.data?.message || 
      error.message ||
      "Order validation failed. Please try again.";
    
    throw new Error(errorMessage);
  }
}
