import type { BrandSearchResult, BrandSearchApiResponse } from "@/types/brandSearch";
import { brandApi } from "@/lib/valuedesignApi";
import { AxiosError } from "axios";

export const searchBrands = async (query: string): Promise<BrandSearchResult[]> => {
  // Don't make API call if query is empty
  if (!query || query.trim() === "") {
    console.log("🔥🔥 Empty query, returning empty array");
    return [];
  }

  console.log("🔥🔥 SENDING SEARCH REQUEST with query:", query);

  try {
    const res = await brandApi.post<BrandSearchApiResponse[]>(
      "/brands/search",
      { searchText: query.trim() },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("🔥🔥 RAW BRAND SEARCH API RESPONSE:", res.data);
    console.log("🔥🔥 Response status:", res.status);
    console.log("🔥🔥 Number of results:", res.data?.length || 0);

    return res.data.map((b): BrandSearchResult => ({
      brandId: b.brandId,
      brandName: b.brandName,
      category: b.category,
      image: b.image,
    }));
  } catch (error) {
    console.error("🔥🔥 SEARCH API ERROR:", error);
    if (error instanceof AxiosError) {
      console.error("🔥🔥 Error response:", error.response?.data);
      console.error("🔥🔥 Error status:", error.response?.status);
    }
    return [];
  }
};
