// src/hooks/useSendEmail.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SendEmailRequest {
  clientId: string;
  orderNumber: string;
  templateName: string;
}

const sendEmail = async (data: SendEmailRequest): Promise<void> => {
  const response = await axios.post(
    `${import.meta.env.VITE_MAIL_URL}/mail/send`,
    data
  );
  return response.data;
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: sendEmail,
    onError: (error) => {
      console.error("Email send failed:", error);
    },
  });
};
