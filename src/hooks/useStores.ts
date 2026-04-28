import { useQuery } from "@tanstack/react-query";
import { getStores } from "../api/storesApi";

export const useStores = (brandId: string | undefined) => {
  return useQuery({
    queryKey: ["stores", brandId],
    queryFn: () => getStores(brandId!),
    enabled: !!brandId, 
  });
};