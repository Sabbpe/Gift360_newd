import { useQuery } from "@tanstack/react-query";
import { getBrandNames } from "../api/brandNamesApi";

export const useBrandNames = () => {
  return useQuery({
    queryKey: ["brandNames"],
    queryFn: getBrandNames
  });
};