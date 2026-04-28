import { useQuery } from "@tanstack/react-query";
import { filterBrands } from "@/api/filterApi";
import type { FilterRequestBody } from "@/types/filter";

export const useFilteredBrands = (filters: FilterRequestBody) => {
  return useQuery({
    queryKey: ["filtered-brands", filters],
    queryFn: () => filterBrands(filters),
    placeholderData: (prev) => prev,
  });
};
