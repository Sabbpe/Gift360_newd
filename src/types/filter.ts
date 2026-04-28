export interface FilterRequestBody {
  categories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string | null;
  discountRanges: string[];
}

export interface FilteredBrand {
  brandId: string;
  brandName: string;
  category: string;
  image: string | null;
  discount?: string;
}
