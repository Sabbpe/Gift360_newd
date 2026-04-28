import { useMutation } from "@tanstack/react-query";
import { confirmCoupon } from "@/api/couponApi";
import type { ConfirmCouponRequest, ConfirmCouponResponse } from "@/types/coupon";
import { AxiosError } from "axios";

export const useConfirmCoupon = () => {
  return useMutation<ConfirmCouponResponse, AxiosError, ConfirmCouponRequest>({
    mutationFn: confirmCoupon,
  });
};
