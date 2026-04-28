// contexts/ConfigContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import appConfig from "@/config/config.json";

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

interface ConfigContextType {
  config: AppConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigContext.Provider value={{ config: appConfig as AppConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};
