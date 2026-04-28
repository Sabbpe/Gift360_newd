// types/coupon.ts
export interface FetchCouponsRequest {
  clientId: string;
  orderNumber: string;
}

export interface FetchCouponsResponse {
  message: string;
}
