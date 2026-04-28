// src/api/couponApi.ts
import { giftcardApiClient } from "@/lib/valuedesignApi";
import type {
  ConfirmCouponRequest,
  ConfirmCouponResponse,
  ReleaseCouponRequest,
  ReleaseCouponResponse,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from "@/types/coupon";

export class CouponValidationError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "CouponValidationError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Validates a coupon code
 * POST /coupon-codes/validate
 * Includes Authorization header via giftcardApiClient interceptor
 */
export const validateCoupon = async (
  request: ValidateCouponRequest
): Promise<ValidateCouponResponse> => {
  try {
    // Log request payload for debugging
    console.log('[validateCoupon] Request payload:', {
      endpoint: '/coupon-codes/validate',
      couponCode: request.couponCode,
      orderId: request.orderId,
      clientId: request.clientId,
      subtotal: request.subtotal,
      fee: request.fee,
      employeeId: request.employeeId,
      corporateId: request.corporateId,
      itemsCount: request.items.length,
      timestamp: new Date().toISOString()
    });

    const response = await giftcardApiClient.post<ValidateCouponResponse>(
      "/coupon-codes/validate",
      request
    );
    
    // Log successful response for debugging
    console.log('[validateCoupon] Response received:', {
      status: response.status,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    return {
      ...response.data,
      httpStatus: response.status,
      httpMessage: response.statusText,
    };
  } catch (error: any) {
    // Enhanced error handling
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      // Log error response for debugging
      console.error('[validateCoupon] Error response:', {
        status,
        data: responseData,
        request: request,
        timestamp: new Date().toISOString()
      });
      
      // Special handling for 500 errors
      if (status === 500) {
        const errorMessage = responseData?.message || 'Internal server error occurred';
        const errorType = responseData?.error || 'Failed';
        
        console.error('[validateCoupon] 500 Internal Server Error:', {
          error: errorType,
          message: errorMessage,
          fullResponse: responseData
        });
        
        throw new CouponValidationError(errorMessage, status, responseData);
      }
      
      // Handle 401 Unauthorized
      if (status === 401) {
        console.error('[validateCoupon] 401 Unauthorized - Token missing or invalid');
        throw new CouponValidationError('Authentication required. Please login again.', status, responseData);
      }
      
      // Handle 404 or invalid coupon
      if (status === 404 || status === 400) {
        throw new CouponValidationError(
          responseData?.message || 'Invalid coupon code',
          status,
          responseData
        );
      }
      
      // Handle other error statuses
      throw new CouponValidationError(
        responseData?.message || `Request failed with status ${status}`,
        status,
        responseData
      );
    }
    
    // Network or other errors
    console.error('[validateCoupon] Network or unexpected error:', error);
    throw error;
  }
};

export const confirmCoupon = async (
  request: ConfirmCouponRequest
): Promise<ConfirmCouponResponse> => {
  try {
    const response = await giftcardApiClient.post<ConfirmCouponResponse>(
      "/coupon-codes/confirm",
      request
    );
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to confirm coupon";
    throw new Error(message);
  }
};

export const releaseCoupon = async (
  request: ReleaseCouponRequest
): Promise<ReleaseCouponResponse> => {
  try {
    const response = await giftcardApiClient.post<ReleaseCouponResponse>(
      "/coupon-codes/release",
      request
    );
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to release coupon";
    throw new Error(message);
  }
};
