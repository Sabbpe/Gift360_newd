// src/hooks/useGuardRails.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import type { GuardRailsData } from '@/types/guardRails';
import { guardRailsApi } from '@/api/guardRailsApi';

interface UseGuardRailsReturn {
  data: GuardRailsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGuardRails = (): UseGuardRailsReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const [data, setData] = useState<GuardRailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuardRails = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const brands = await guardRailsApi.getBrands();
      
      setData({
        brands,
        clientUsage: 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchGuardRails();
  }, [fetchGuardRails]);

  return {
    data,
    loading,
    error,
    refetch: fetchGuardRails,
  };
};
