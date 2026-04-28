export interface StoreApiResponse {
  storeId: string;
  brandCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  StoreId: string;
  BrandCode: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  ContactNumber: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface NearbyStoreRequest {
  lat: number;
  lng: number;
  brandCode: string;
}

export interface NearbyStoreApiResponse {
  store_id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contact_number: string | null;
  latitude: number;
  longitude: number;
  distance_km: number;
}

export interface NearbyStoresResponse {
  brand_code: string;
  center: {
    latitude: string;
    longitude: string;
  };
  radius_km: string;
  stores: NearbyStoreApiResponse[];
}

export interface NearbyStore {
  storeId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface NearbyBrandsRequest {
  lat: number;
  lng: number;
  category: string;
}

export interface NearbyBrandApiResponse {
  brand_id: string;
  brand_code: string;
  brand_name: string;
  category: string;
  brand_type: string;
  denomination_list: string;
  min_price: number;
  max_price: number;
  stock_available: number;
  description: string;
  tnc: string;
  images: string;
  important_instruction: Record<string, string>;
  redeem_steps: Array<{
    title: string;
    image: string;
  }>;
  availability: string;
  created_at: string;
  updated_at: string;
  nearest_distance_km: number;
}

export interface NearbyBrandsResponse {
  category: string;
  center: {
    latitude: string;
    longitude: string;
  };
  radius_km: string;
  brands: NearbyBrandApiResponse[];
}

export interface NearbyBrand {
  brandId: string;
  brandCode: string;
  brandName: string;
  category: string;
  brandType: string;
  minPrice: number;
  maxPrice: number;
  images: any;
  nearestDistanceKm: number;
}
