// hooks/useAppConfig.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CONFIG_URL = "https://your-domain.com/config.json"; // Your team lead's JSON URL

interface NavLink {
  label: string;
  href: string;
  enabled: boolean;
}

interface AppConfig {
  header: {
    enabled: boolean;
    logo: { enabled: boolean };
    navigation: {
      enabled: boolean;
      links: NavLink[];
    };
    searchBar: { enabled: boolean };
    locationButton: { enabled: boolean };
    authButton: { enabled: boolean };
    themeToggle: { enabled: boolean };
    cart: { enabled: boolean };
    marquee: { enabled: boolean };
  };
  homePage: {
    enabled: boolean;
    hero: { enabled: boolean };
    hotDeals: { enabled: boolean };
    promoCard: { enabled: boolean };
    featuredVouchers: { enabled: boolean };
  };
  footer: {
    enabled: boolean;
  };
}

// Default config as fallback
const defaultConfig: AppConfig = {
  header: {
    enabled: true,
    logo: { enabled: true },
    navigation: {
      enabled: true,
      links: [
        { label: "Home", href: "/", enabled: true },
        { label: "Brands", href: "/brands", enabled: true },
        { label: "Categories", href: "/categories", enabled: true },
        { label: "Offers", href: "/offers", enabled: true },
      ],
    },
    searchBar: { enabled: true },
    locationButton: { enabled: true },
    authButton: { enabled: true },
    themeToggle: { enabled: true },
    cart: { enabled: true },
    marquee: { enabled: true },
  },
  homePage: {
    enabled: true,
    hero: { enabled: true },
    hotDeals: { enabled: true },
    promoCard: { enabled: true },
    featuredVouchers: { enabled: true },
  },
  footer: {
    enabled: true,
  },
};

export const useAppConfig = () => {
  return useQuery<AppConfig>({
    queryKey: ["app-config"],
    queryFn: async () => {
      const response = await axios.get(CONFIG_URL);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    placeholderData: defaultConfig, // Use default while loading
  });
};
