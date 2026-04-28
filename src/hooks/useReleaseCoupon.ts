import { useMutation } from "@tanstack/react-query";
import { releaseCoupon } from "@/api/couponApi";
import type { ReleaseCouponRequest, ReleaseCouponResponse } from "@/types/coupon";
import { AxiosError } from "axios";

export const useReleaseCoupon = () => {
  return useMutation<ReleaseCouponResponse, AxiosError, ReleaseCouponRequest>({
    mutationFn: releaseCoupon,
  });
};
