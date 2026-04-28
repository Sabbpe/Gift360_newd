import { useQuery } from "@tanstack/react-query";
import { searchBrands } from "../api/brandSearchApi";

export const useBrandSearch = (query: string) => {
  return useQuery({
    queryKey: ["brandSearch", query],
    queryFn: () => {
      console.log("🔥🔥 useBrandSearch queryFn called with:", query);
      return searchBrands(query);
    },
    enabled: query.trim().length > 0, // Only run query if there's a non-empty search term
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once on failure
  });
};