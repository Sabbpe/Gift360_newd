import { giftcardApiClient } from "@/lib/valuedesignApi";
import type { OrderRequest, OrderResponse } from "@/types/cart";
import type { OrdersResponse } from "@/types/order";
import type { FetchCouponsRequest, FetchCouponsResponse } from "@/types/coupon";

export const createOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await giftcardApiClient.post("/orders", orderData);
  return response.data;
};

export const fetchOrders = async (
  clientId: string
): Promise<OrdersResponse> => {
  const response = await giftcardApiClient.post(`/orders/json/${clientId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderNumber: string,
  status: "PAID" | "FAILED"
): Promise<string> => {
  const response = await giftcardApiClient.post(`/orders/status`, {
    encryptedData: orderNumber,
    status: status,
  });
  return response.data;
};

export const fetchCoupons = async (
  request: FetchCouponsRequest
): Promise<FetchCouponsResponse> => {
  try {
    // Log request payload for debugging
    console.log('[fetchCoupons] Request payload:', {
      endpoint: '/coupons/fetch',
      clientId: request.clientId,
      orderNumber: request.orderNumber,
      timestamp: new Date().toISOString()
    });

    const response = await giftcardApiClient.post("/coupons/fetch", request);
    
    // Log successful response for debugging
    console.log('[fetchCoupons] Response received:', {
      status: response.status,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    return response.data;
  } catch (error: any) {
    // Enhanced error handling
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      // Log error response for debugging
      console.error('[fetchCoupons] Error response:', {
        status,
        data: responseData,
        request: request,
        timestamp: new Date().toISOString()
      });
      
      // Special handling for 500 errors
      if (status === 500) {
        const errorMessage = responseData?.message || 'Internal server error occurred';
        const errorType = responseData?.error || 'Failed';
        
        console.error('[fetchCoupons] 500 Internal Server Error:', {
          error: errorType,
          message: errorMessage,
          fullResponse: responseData
        });
        
        // Throw a user-friendly error with backend message
        throw new Error(errorMessage);
      }
      
      // Handle 401 Unauthorized
      if (status === 401) {
        console.error('[fetchCoupons] 401 Unauthorized - Token missing or invalid');
        throw new Error('Authentication required. Please login again.');
      }
      
      // Handle other error statuses
      throw new Error(responseData?.message || `Request failed with status ${status}`);
    }
    
    // Network or other errors
    console.error('[fetchCoupons] Network or unexpected error:', error);
    throw error;
  }
};
