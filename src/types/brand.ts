export interface BrandApiResponse {
  brandId: string;
  brandName: string;
  category: string;
  image: string | null;
  discount?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BrandImages {
  main?: string;
  text?: string,
  thumbnail?: string;
  featured?: string;
  mobile?: string;
  base?: string;
  small?: string;
  raw?: string;
}

export interface Brand {
  BrandId: string;
  BrandName: string;
  Category: string;
  Images: BrandImages | null;
  Discount?: string;
  MinPrice?: number;
  MaxPrice?: number;
}


