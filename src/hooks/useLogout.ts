import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/authApi";
import type { LogoutRequest, ValidationError } from "@/types/auth";
import { AxiosError } from "axios";

export const useLogout = () => {
  return useMutation<string, AxiosError<ValidationError>, LogoutRequest>({
    mutationFn: logout,
  });
};
