import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BRAND_API_URL;

export type ContactRole = "DISTRIBUTOR" | "RESELLER" | "CORPORATE" | "GENERAL";

export interface ContactLeadRequest {
  role: ContactRole;
  fullName?: string;
  email?: string;
  companyName?: string;
  phoneNumber?: string;
  organizationName?: string;
  city?: string;
  state?: string;
  pan?: string;
  gst?: string;
  message?: string;
  sampleInvoiceUrl?: string;
}

export interface ContactLeadResponse {
  success: boolean;
  message: string;
  leadId?: string;
}

/**
 * Submit a new lead contact to the backend
 * @param data - Contact form data with role to differentiate between types
 * @returns Promise with the API response
 */
export const submitContactLead = async (
  data: ContactLeadRequest
): Promise<ContactLeadResponse> => {
  try {
    const response = await axios.post<ContactLeadResponse>(
      `${API_BASE_URL}/v1/new-lead-contacts`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to submit contact form"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
