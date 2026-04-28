import { useQuery } from "@tanstack/react-query";
import { getNearbyStores } from "../api/storesApi";
import type { NearbyStoreRequest } from "@/types/store";

export const useNearbyStores = (
  request: NearbyStoreRequest | null,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["nearbyStores", request?.lat, request?.lng, request?.brandCode],
    queryFn: () => getNearbyStores(request!),
    enabled: enabled && !!request && !!request.brandCode,
  });
};
