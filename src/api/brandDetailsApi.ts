import { brandApi } from "@/lib/valuedesignApi";
import type { BrandDetailsApiResponse, BrandDetailsParsed } from "@/types/brandDetails";

export const getBrandDetails = async (brandId: string): Promise<BrandDetailsParsed> => {
  console.log("🔥 BrandDetails API CALLED with brandId =", brandId);

  const res = await brandApi.post<BrandDetailsApiResponse>(
    `/brands/${brandId}`,
    {}
  );

  const b = res.data;
  console.log("🔥 Raw Brand API Response =", b);

  let parsedImages = null;
  try {
    parsedImages = b.images ? JSON.parse(b.images) : null;
  } catch {
    parsedImages = null;
  }

  // Parse instructions
  let parsedInstructions: Record<string, string> = {};
  if (b.importantInstruction) {
    try {
      parsedInstructions = JSON.parse(b.importantInstruction);
    } catch {
      parsedInstructions = {};
    }
  }

  // Parse redeem steps
  let parsedRedeemSteps: Array<{ title: string; image?: string }> = [];
  try {
    parsedRedeemSteps = JSON.parse(b.redeemSteps);
  } catch {
    parsedRedeemSteps = [];
  }

  // Parse T&C
  let parsedTnc: Record<string, string> | string = "";
  if (b.tnc) {
    try {
      parsedTnc = JSON.parse(b.tnc);
    } catch {
      parsedTnc = b.tnc;
    }
  }

  return {
    BrandCode: b.brandCode,
    BrandId: b.brandId,
    BrandName: b.brandName,
    BrandType: b.brandType,
    Category: b.category,
    Description: b.description,

    Discount: Number(b.discount) || 0,
    minPrice: Number(b.minPrice) || 0,
    maxPrice: Number(b.maxPrice) || 0,

    StockAvailable: Number(b.stockAvailable) || 0,

    Images: parsedImages,

    DenominationList:
      typeof b.denominationList === "string"
        ? b.denominationList.split(",").map((v: string) => Number(v.trim()))
        : Array.isArray(b.denominationList)
        ? b.denominationList.map((v: string) => Number(v))
        : [],

    ImportantInstruction: parsedInstructions,
    RedeemSteps: parsedRedeemSteps,
    Tnc: parsedTnc,

    CreatedAt: b.createdAt || null,
    UpdatedAt: b.updatedAt || null,
  };
};
