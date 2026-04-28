// hooks/useValidateCoupon.ts
import { useMutation } from "@tanstack/react-query";
import { validateCoupon } from "@/api/couponApi";
import type { ValidateCouponRequest, ValidateCouponResponse } from "@/types/coupon";

export const useValidateCoupon = () => {
  return useMutation<ValidateCouponResponse, Error, ValidateCouponRequest>({
    mutationFn: validateCoupon,
  });
};
