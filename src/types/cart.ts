// types/cart.ts
export interface CartItem {
  itemId: string;       
  brandId: string;
  brandName: string;
  quantity: number;
  unitValue: number;
  lineTotal: number;
  image?: string;
}
export interface Cart {
  clientId: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  totalItems: number;
}

export interface AddToCartRequest {
  brandId: string;
  brandName: string;
  quantity: number;
  unitValue: number;
  image?: string;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface OrderRequest {
  order: {
    clientId: string;
    orderNumber: string;
    totalAmount: number;
    currency: string;
    status: string;
    walletUsed?: boolean; 
    walletAmount?: number;
  };
  items: {
    brandId: string;
    quantity: number;
    unitValue: number;
    lineTotal: number;
    meta: string; 
  }[];
}


export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  message: string;
}
