import { useQuery } from "@tanstack/react-query";
import { getBrandDetails } from "@/api/brandDetailsApi";

export const useBrandDetails = (brandId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["brand-details", brandId],
    queryFn: () => {
      console.log("🔥 BrandDetails API CALLED with brandId =", brandId);
      return getBrandDetails(brandId);
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!brandId, // ✅ Respect enabled option
  });
};
