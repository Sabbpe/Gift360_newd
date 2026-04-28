import { useQuery } from "@tanstack/react-query";
import { getFilterMeta } from "@/api/filterMetaApi";

export const useFilterMeta = () => {
  return useQuery({
    queryKey: ["filter-meta"],
    queryFn: getFilterMeta,
  });
};
