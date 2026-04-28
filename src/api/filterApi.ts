import { brandApi } from "@/lib/valuedesignApi";
import type { FilterRequestBody, FilteredBrand } from "@/types/filter";

export const filterBrands = async (
  body: FilterRequestBody
): Promise<FilteredBrand[]> => {
  const res = await brandApi.post(
    "/brands/filter",
    body
  );

  return res.data;
};
