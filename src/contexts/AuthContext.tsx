// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AuthUser } from "@/types/auth";
import { useLocation } from "wouter";
import { SessionExpiredDialog } from "@/components/SessionExpiredDialog";

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  // Listen for token expiry from axios interceptor
  useEffect(() => {
    const handleTokenExpired = () => {
      const currentPath = window.location.pathname || "";
      const isPaymentResultPage = currentPath.includes("/payment-result");

      // Never force session-expired dialog on payment result page.
      // Payment callback result should remain visible even on 401 from background calls.
      if (isPaymentResultPage) {
        console.warn("auth:expired ignored on payment-result page");
        return;
      }

      // Clear cart merge flag on token expiry
      if (user?.clientId) {
        localStorage.removeItem(`cart_merged_${user.clientId}`);
      }
      setUser(null);
      setShowExpiredDialog(true);
    };

    window.addEventListener("auth:expired", handleTokenExpired);
    return () => window.removeEventListener("auth:expired", handleTokenExpired);
  }, [user]);

  const handleLoginRedirect = () => {
    setShowExpiredDialog(false);
    setLocation("/login?session=expired"); // ✅ Pass expired flag
  };

  const logout = () => {
      // Clear cart merge flag before logging out
  if (user?.clientId) {
    localStorage.removeItem(`cart_merged_${user.clientId}`);
  }
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
      <SessionExpiredDialog
        open={showExpiredDialog}
        onLoginRedirect={handleLoginRedirect}
      />
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
