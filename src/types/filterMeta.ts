export interface PriceRange {
  label: string;
  min: number | null;
  max: number | null;
}

export interface DiscountRange {
  label: string;
  value?: string;
}


export interface FilterMetaApiResponse {
  categories: string[];
  brands: string[];
  priceRanges: PriceRange[];
  sortOptions: string[];
  discountRanges: DiscountRange[]
}
