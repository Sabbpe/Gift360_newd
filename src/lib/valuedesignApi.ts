import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// In dev with no env set, use Vite proxy: requests to /api/* go to backend (e.g. localhost:8081).
const BRAND_API_URL =
  import.meta.env.VITE_BRAND_API_URL ??
  (import.meta.env.DEV ? "/api" : undefined);
const GIFTCARD_API_URL = import.meta.env.VITE_GIFTCARD_API_URL;

// Common request interceptor function
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  const authUser = localStorage.getItem("authUser");
  if (authUser) {
    const user = JSON.parse(authUser);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
};

// Common response interceptor function
const handleAuthError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Don't fire auth:expired if we're on payment-result page
    // This allows the payment result to be shown even if session is expired
    const currentPath = window.location.pathname || "";
    const isPaymentResultPage = /^\/payment-result\/?$/i.test(currentPath);
    if (!isPaymentResultPage) {
      localStorage.removeItem("authUser");
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
  }
  return Promise.reject(error);
};

// BRAND API INSTANCE
export const brandApi = axios.create({
  baseURL: BRAND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

brandApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
brandApi.interceptors.response.use((response) => response, handleAuthError);

// GIFTCARD API INSTANCE
export const giftcardApiClient = axios.create({
  baseURL: GIFTCARD_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

giftcardApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
giftcardApiClient.interceptors.response.use((response) => response, handleAuthError);

export const ordersApiClient = axios.create({
  baseURL: BRAND_API_URL, // ✅ https://vdspbck.gift360.io/api
  headers: {
    "Content-Type": "application/json",
  },
});

ordersApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
ordersApiClient.interceptors.response.use((response) => response, handleAuthError);

export const cartApiClient = axios.create({
  baseURL: BRAND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
