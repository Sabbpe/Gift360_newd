// src/hooks/useBrandGuardRail.ts
import { useState, useCallback, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { guardRailsApi } from '@/api/guardRailsApi';
import type { Brand } from '@/types/guardRails';

interface UseBrandGuardRailReturn {
  brandGuardRail: Brand | null;
  currentUsage: number;
  canPurchase: boolean;
  limitError: string;
  checkAmount: (amount: number, quantity: number) => boolean;
  loading: boolean;
}

export const useBrandGuardRail = (
  brandCode?: string,
  brandId?: string
): UseBrandGuardRailReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const [limitError, setLimitError] = useState('');
  const [currentUsage, setCurrentUsage] = useState(0);
  const [brandGuardRail, setBrandGuardRail] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch guard rail and usage for this specific brand
  useEffect(() => {
    const fetchBrandGuardRail = async () => {
      if (!isAuthenticated || !user || !brandId) {
        setBrandGuardRail(null);
        setCurrentUsage(0);
        return;
      }

      setLoading(true);
      try {
        // Fetch all brands
        const brands = await guardRailsApi.getBrands();
        
        // Find the guard rail for this brand
        const matchedBrand = brands.find(
          (gr) =>
            gr.brandCode.toLowerCase() === brandCode?.toLowerCase() ||
            gr.brandCode.toLowerCase().includes(brandCode?.toLowerCase() || '') ||
            brandCode?.toLowerCase().includes(gr.brandCode.toLowerCase())
        );

        setBrandGuardRail(matchedBrand || null);

        // Fetch usage for this specific brand using brandId
        if (matchedBrand) {
          const usage = await guardRailsApi.getClientUsage({
            clientId: user.clientId,
            brandId: brandId, // Use the actual brand UUID
          });
          setCurrentUsage(usage);
        } else {
          setCurrentUsage(0);
        }
      } catch (err) {
        console.error('Failed to fetch brand guard rail:', err);
        setBrandGuardRail(null);
        setCurrentUsage(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandGuardRail();
  }, [isAuthenticated, user, brandId, brandCode]);

  // Check if amount is within limit
  const checkAmount = useCallback(
    (amount: number, quantity: number): boolean => {
      if (!isAuthenticated || !brandGuardRail) {
        setLimitError('');
        return true;
      }

      const requestedAmount = amount * quantity;
      const totalAfterPurchase = currentUsage + requestedAmount;
      const remaining = Math.max(0, brandGuardRail.monthlyLimit - currentUsage);

      if (totalAfterPurchase > brandGuardRail.monthlyLimit) {
        setLimitError(
          `Exceeds monthly limit by ₹${(totalAfterPurchase - brandGuardRail.monthlyLimit).toFixed(2)}`
        );
        return false;
      }

      if (requestedAmount > remaining) {
        setLimitError(`Only ₹${remaining.toFixed(2)} remaining in your limit`);
        return false;
      }

      setLimitError('');
      return true;
    },
    [isAuthenticated, brandGuardRail, currentUsage]
  );

  return {
    brandGuardRail,
    currentUsage,
    canPurchase: !limitError,
    limitError,
    checkAmount,
    loading,
  };
};
