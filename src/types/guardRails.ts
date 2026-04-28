// src/types/guardRails.ts
export interface Brand {
  brandCode: string;
  createdAt: string;
  currency: string;
  isActive: boolean;
  monthlyLimit: number;
  updatedAt: string;
}

export interface ClientUsageRequest {
  clientId: string;
  brandId: string;
}

export interface GuardRailsData {
  brands: Brand[];
  clientUsage: number;
}

export interface GuardRailsError {
  message: string;
  code?: string;
}
