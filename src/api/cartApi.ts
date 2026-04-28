// api/cartApi.ts
import { cartApiClient } from "@/lib/valuedesignApi";
import type { Cart, AddToCartRequest, UpdateQuantityRequest } from "@/types/cart";

export const getCart = async (clientId: string): Promise<Cart> => {
  const response = await cartApiClient.post(`/cart/${clientId}`);
  return response.data;
};

// ADD THIS FUNCTION IF NOT PRESENT:
export const mergeCart = async (
  clientId: string,
  guestItems: AddToCartRequest[]
): Promise<Cart> => {
  // Add each guest cart item to the backend cart
  for (const item of guestItems) {
    await addToCart(clientId, item);
  }
  
  // Return the updated cart
  const response = await cartApiClient.post(`/cart/${clientId}`);
  return response.data;
};

export const addToCart = async (
  clientId: string,
  item: AddToCartRequest
): Promise<Cart> => {
  const response = await cartApiClient.post(`/cart/${clientId}/add`, item);
  return response.data;
};

export const updateCartQuantity = async (
  clientId: string,
  itemId: string,
  quantity: UpdateQuantityRequest
): Promise<Cart> => {
  const response = await cartApiClient.post(
    `/cart/${clientId}/update/${itemId}`,
    quantity
  );
  return response.data;
};

export const removeFromCart = async (
  clientId: string,
  itemId: string
): Promise<Cart> => {
  const response = await cartApiClient.post(
    `/cart/${clientId}/remove/${itemId}`
  );
  return response.data;
};

export const clearCart = async (clientId: string): Promise<void> => {
  await cartApiClient.post(`/cart/${clientId}/clear`);
};
