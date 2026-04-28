// hooks/useFetchCoupons.ts
import { useMutation } from "@tanstack/react-query";
import { fetchCoupons } from "@/api/orderApi";
import type { FetchCouponsRequest, FetchCouponsResponse } from "@/types/coupon";
import { AxiosError } from "axios";

export const useFetchCoupons = () => {
  return useMutation<FetchCouponsResponse, AxiosError, FetchCouponsRequest>({
    mutationFn: fetchCoupons,
  });
};
