// types/order.ts
export interface OrderItemMeta {
  brand_id: string;
  brand_code: string;
  brand_name: string;
  category: string;
  images: string; // JSON string
}

export interface CouponItem {
  getCardNo: string;
  getCardPin: string;
  getCardStatus: string;
  getExpiryDate: string;
  balanceBasic: string;
  balanceBonus: string;
  balanceTotal: string;
  bonusGiven: string;
  dealNo: string;
  receiptNo: string;
}

export interface BrandDetail {
  product_name: string;
  voucher_name: string;
  items: CouponItem[];
}

export interface VDRawResponse {
  brand_details: BrandDetail[];
  wallet_balance: string;
}

export interface Coupon {
  coupon_id: string;
  vd_raw_response: VDRawResponse;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_item_id: string;
  brand_id: string;
  quantity: number;
  unit_value: number;
  line_total: number;
  meta: OrderItemMeta | Record<string, never>;
  created_at: string;
  coupons?: Coupon[]; // ✅ Added coupons
}

export interface Order {
  order_id: string;
  client_id: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  items: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface ValidateOrderRequest {
  orderNumber: string;
  cartTotal: number;
  walletAmount: number;
  walletUsed: boolean;
}

export interface OrderDetails {
  totalAmount: number;
  walletAmount: number;
  walletUsed: boolean;
  status: string;
}

export interface ValidateOrderResponse {
  valid: boolean;
  message: string;
  requiresPayment: boolean;
  amountToPay: number;
  orderNumber: string;
  orderDetails?: OrderDetails;
}
