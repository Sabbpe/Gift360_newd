// hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/api/orderApi";
import type { OrdersResponse } from "@/types/order";

export const useOrders = (clientId: string | undefined) => {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", clientId],
    queryFn: () => fetchOrders(clientId!),
    enabled: !!clientId, // Only run if clientId exists
    staleTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: true,
  });
};
