import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "./pages/Home";
import DistributorLandingPage from "./pages/DistributorLandingPage";
import ResellerLandingPage from "./pages/ResellerLandingPage";
import CorporateLandingPage from "./pages/CorporateLandingPage";
import Brands from "./pages/Brands";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import VoucherDetails from "./pages/VoucherDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/not-found";
import BrandDetailsPage from "./pages/BrandDetailsPage";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./contexts/SimpleTheme";
import { GuideProvider } from "./contexts/GuideContext";
import { useBrowserLocation } from "wouter/use-browser-location";
import { AuthProvider } from "./contexts/AuthContext";
import PaymentResult from "./pages/PaymentResult";
import { ConfigProvider } from "./contexts/ConfigContext";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import GiftVoucherChatbot from "./components/Giftvoucherchatbot";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Nearby from "./pages/Nearby";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import BlogPage from "./pages/BlogPage";
import SingleBlogPage from "./pages/SingleBlogPage";
import FAQPage from "./pages/FAQPage";
import LoginIssues from "./pages/LoginIssues";
import BulkPurchase from "./pages/BulkPurchase";

const ONBOARDING_KEY = "g360_onboarding_v3";

function AppRoutes() {
  const [location] = useLocation();
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === "true"
  );

  // Listen for localStorage changes and location changes
  useEffect(() => {
    const checkOnboarding = () => {
      setOnboardingComplete(localStorage.getItem(ONBOARDING_KEY) === "true");
    };

    // Check on every location change
    checkOnboarding();

    // Listen for storage events (cross-tab)
    window.addEventListener("storage", checkOnboarding);
    
    return () => window.removeEventListener("storage", checkOnboarding);
  }, [location]);

  // First time user - show onboarding on root path
  if (!onboardingComplete && location === "/") {
    return <Onboarding />;
  }

  // Manual navigation to onboarding
  if (location === "/onboarding") {
    return <Onboarding />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/distributor" component={DistributorLandingPage} />
      <Route path="/reseller" component={ResellerLandingPage} />
      <Route path="/corporate" component={CorporateLandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/brands" component={Brands} />
      <Route path="/brands/:id" component={BrandDetailsPage} />
      <Route path="/categories" component={Categories} />
      <Route path="/offers" component={Offers} />
      <Route path="/voucher/:id" component={VoucherDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/payment-result" component={PaymentResult} />
      <Route path="/orders" component={Orders} />
      <Route path="/orders/:id" component={OrderDetails} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/nearby" component={Nearby} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/refund" component={Refund} />
      <Route path="/profile" component={Profile} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/blogs" component={BlogPage} />
      <Route path="/blogs/:id" component={SingleBlogPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/login-issues" component={LoginIssues} />
      <Route path="/bulk-purchase" component={BulkPurchase} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter hook={useBrowserLocation}>
      <ThemeProvider>
        <GuideProvider>
          <TooltipProvider>
            <AuthProvider>
              <ConfigProvider>
                <AppRoutes />
                <Toaster />
                {/* <GiftVoucherChatbot /> */}
              </ConfigProvider>
            </AuthProvider>
          </TooltipProvider>
        </GuideProvider>
      </ThemeProvider>
    </WouterRouter>
  );
}
