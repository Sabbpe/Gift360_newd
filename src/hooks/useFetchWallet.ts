import { useQuery } from "@tanstack/react-query";
import { fetchWalletBalance } from "@/api/walletApi";
import type { WalletBalance } from "@/api/walletApi";
import { AxiosError } from "axios";

export const useFetchWallet = (clientId: string | undefined) => {
  return useQuery<WalletBalance, AxiosError>({
    queryKey: ["wallet", clientId],
    queryFn: () => fetchWalletBalance(clientId!),
    enabled: !!clientId, 
    staleTime: 30000,
  });
};
