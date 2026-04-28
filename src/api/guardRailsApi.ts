// src/api/guardRails.api.ts
import { brandApi } from '@/lib/valuedesignApi';
import { AxiosError } from 'axios';
import type { Brand, ClientUsageRequest } from '@/types/guardRails';

// Define error response type
interface ApiErrorResponse {
  message: string;
  error?: string;
  code?: string;
  status?: number;
}

export const guardRailsApi = {
  /**
   * Fetches all brands with their guard rail configurations
   * Includes Authorization header via brandApi interceptor
   */
  async getBrands(): Promise<Brand[]> {
    try {
      console.log('[guardRailsApi] Fetching brands from /guard-rails/brands');
      
      const response = await brandApi.post<Brand[]>('/guard-rails/brands');
      
      console.log('[guardRailsApi] Brands fetched successfully:', {
        count: response.data?.length || 0,
        status: response.status,
      });
      
      return response.data;
    } catch (error) {
      // Enhanced error logging for debugging
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const responseData = error.response?.data as ApiErrorResponse | undefined;
        
        console.error('[guardRailsApi] Failed to fetch brands:', {
          status,
          statusText: error.response?.statusText,
          error: responseData?.error,
          message: responseData?.message,
          endpoint: '/guard-rails/brands',
          method: 'POST',
          timestamp: new Date().toISOString(),
          fullResponse: responseData,
        });
        
        // Special handling for 500 errors
        if (status === 500) {
          const errorMessage = responseData?.message || responseData?.error || 'Internal server error while fetching brands';
          throw new Error(`Server Error: ${errorMessage}`);
        }
        
        // Handle 401 Unauthorized
        if (status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(
          responseData?.message || error.message || 'Failed to fetch brands'
        );
      }
      
      console.error('[guardRailsApi] Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching brands');
    }
  },

  /**
   * Fetches client usage for specific brand
   * Includes Authorization header via brandApi interceptor
   */
  async getClientUsage(payload: ClientUsageRequest): Promise<number> {
    try {
      console.log('[guardRailsApi] Fetching client usage:', {
        clientId: payload.clientId,
        brandId: payload.brandId,
      });
      
      const response = await brandApi.post<number>(
        '/guard-rails/client-usage',
        payload
      );
      
      console.log('[guardRailsApi] Client usage fetched:', {
        usage: response.data,
        status: response.status,
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const responseData = error.response?.data as ApiErrorResponse | undefined;
        
        console.error('[guardRailsApi] Failed to fetch client usage:', {
          status,
          statusText: error.response?.statusText,
          error: responseData?.error,
          message: responseData?.message,
          payload,
          endpoint: '/guard-rails/client-usage',
          method: 'POST',
          timestamp: new Date().toISOString(),
          fullResponse: responseData,
        });
        
        // Special handling for 500 errors
        if (status === 500) {
          const errorMessage = responseData?.message || responseData?.error || 'Internal server error while fetching client usage';
          throw new Error(`Server Error: ${errorMessage}`);
        }
        
        // Handle 401 Unauthorized
        if (status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(
          responseData?.message || error.message || 'Failed to fetch client usage'
        );
      }
      
      console.error('[guardRailsApi] Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching client usage');
    }
  },
};
