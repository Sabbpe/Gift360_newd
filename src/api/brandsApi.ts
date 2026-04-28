import type { Brand, BrandApiResponse, BrandImages } from "@/types/brand";
import { brandApi } from "@/lib/valuedesignApi";

export const getBrands = async (): Promise<Brand[]> => {
  const res = await brandApi.post<BrandApiResponse[]>("/brands/getall");

  console.log("🔥🔥 RAW BRAND LIST API RESPONSE:", res.data);

  return res.data.map((b): Brand => {
    let parsedImages: BrandImages | null = null;

    try {
      parsedImages = b.image ? JSON.parse(b.image) : null;
    } catch {
      parsedImages = null;
    }

    return {
      BrandId: b.brandId,
      BrandName: b.brandName,
      Category: b.category,
      Images: parsedImages,
      Discount: b.discount,
      MinPrice: b.minPrice,
      MaxPrice: b.maxPrice,
    };
  });
};
