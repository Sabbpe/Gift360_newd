import { brandApi } from "@/lib/valuedesignApi";
import type { FilterMetaApiResponse } from "@/types/filterMeta";

export const getFilterMeta = async (): Promise<FilterMetaApiResponse> => {
  console.log("🔥 Fetching Filter Meta...");

  const res = await brandApi.post<FilterMetaApiResponse>(
    "/brands/filter-meta",
    {}
  );

  console.log("🔥 Filter Meta Response =", res.data);

  return res.data;
};
