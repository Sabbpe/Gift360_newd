import type { BrandName, BrandNameApiResponse } from "@/types/brandNames";
import { brandApi } from "@/lib/valuedesignApi";

export const getBrandNames = async (): Promise<BrandName[]> => {
  const res = await brandApi.post<BrandNameApiResponse[]>(
    "/brands/getallnames"
  );

  console.log("🔥🔥 RAW BRAND NAMES API RESPONSE:", res.data);

  return res.data.map((b): BrandName => ({
    BrandId: b.brandId,
    BrandName: b.brandName,
  }));
};
