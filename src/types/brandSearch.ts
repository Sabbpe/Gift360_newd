// Backend API response format (camelCase)
export interface BrandSearchApiResponse {
  brandId: string;
  brandName: string;
  category: string;
  image: string | null;
}

// Frontend format for consistency with existing code (both formats supported)
export interface BrandSearchResult {
  brandId: string;
  brandName: string;
  category: string;
  image: string | null;
}