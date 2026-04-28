import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../api/brandsApi";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands
  });
};
