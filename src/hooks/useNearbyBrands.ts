import { useQuery } from "@tanstack/react-query";
import { getNearbyBrands } from "../api/storesApi";
import type { NearbyBrandsRequest } from "@/types/store";

export const useNearbyBrands = (
  request: NearbyBrandsRequest | null,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["nearbyBrands", request?.lat, request?.lng, request?.category],
    queryFn: () => getNearbyBrands(request!),
    enabled: enabled && !!request && !!request.category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};