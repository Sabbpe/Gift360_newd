export interface BrandDetailsApiResponse {
  brandCode: string;
  brandId: string;
  brandName: string;
  brandType: string;
  category: string;
  description: string;
  discount: string;
  images: string | null;
  denominationList: string | string[];
  importantInstruction: string | null;
  redeemSteps: string;
  tnc: string | null;
  minPrice: string;
  maxPrice: string;
  stockAvailable: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BrandDetailsParsed {
  BrandCode: string;
  BrandId: string;
  BrandName: string;
  BrandType: string;
  Category: string;
  Description: string;

  Discount: number;
  minPrice: number;
  maxPrice: number;

  StockAvailable: number;

  Images: {
    text?: string,
    thumbnail?: string;
    featured?: string;
    mobile?: string;
    base?: string;
    small?: string;
    raw?: string;
  } | null;

  DenominationList: number[];

  ImportantInstruction: Record<string, string>;
  RedeemSteps: Array<{ title: string; image?: string; description?: string }>;
  Tnc: Record<string, string> | string;

  CreatedAt: string | null;
  UpdatedAt: string | null;
}
