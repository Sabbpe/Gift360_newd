import { useState, useEffect, useMemo, useRef } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  Info,
  Tag,
  Plus,
  Minus,
  // ChevronDown,
  MapPin,
  Building2,
  Store,
  Navigation,
  X,
  FileText,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useBrandDetails } from "@/hooks/useBrandDetails";
import MobileBottomNav from "@/components/MobileBottomNav";
import { BrandGuardRailStatus } from "@/components/BrandGuardRailStatus";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBrandGuardRail } from "@/hooks/useBrandGuardRail";
import type { NearbyStoreRequest } from "@/types/store";
import { useNearbyStores } from "@/hooks/useNearbyStores";
import { getUserLocation } from "@/utils/geolocation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react"; // Add these icons


const FALLBACK = "/brand-placeholder.png";

async function validateImage(url: string): Promise<string> {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
      setTimeout(() => reject(), 5000);
    });
  } catch {
    return FALLBACK;
  }
}

// ✅ Helper: Snap amount to nearest 100
function snapAmount(value: number): number {
  return Math.round(value / 100) * 100;
}

// ✅ Helper: Map slider position (0-100) to amount with non-linear easing
function mapSliderToAmount(sliderPercent: number, min: number, max: number): number {
  // Apply easing: slower at start, faster at end
  const easedPercent = Math.pow(sliderPercent / 100, 1.8);
  const rawAmount = min + easedPercent * (max - min);
  return snapAmount(rawAmount);
}

// ✅ Helper: Reverse map amount to slider position (0-100)
function mapAmountToSlider(amount: number, min: number, max: number): number {
  const normalizedAmount = (amount - min) / (max - min);
  // Reverse the easing
  const sliderPercent = Math.pow(normalizedAmount, 1 / 1.8) * 100;
  return Math.max(0, Math.min(100, sliderPercent));
}

function TextWithLineBreaks({ text }: { text: string }) {
  const parts = text.split(/<br\s*\/?>/gi);
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

type ModalTab = "redeem" | "instructions" | "terms" | "about";

export default function BrandDetailsPage() {
  const [, params] = useRoute("/brands/:id");
  const brandId = params?.id;

  const { data: brand, isLoading, isError } = useBrandDetails(brandId!);
  const { user, isAuthenticated } = useAuthContext();
  const { brandGuardRail, currentUsage } = useBrandGuardRail(
    brand?.BrandCode || brand?.BrandName,
    brand?.BrandId
  );

  const [imgSrc, setImgSrc] = useState(FALLBACK);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [guardRailExceeded, setGuardRailExceeded] = useState(false);
  const [nearbyStoresRequest, setNearbyStoresRequest] =
    useState<NearbyStoreRequest | null>(null);
  const [enableNearbyQuery, setEnableNearbyQuery] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("about");

  const [showCelebration, setShowCelebration] = useState(false);
const couponControls = useAnimation();
const stampControls = useAnimation();


  const { cart, addToCart } = useCart(user?.clientId);
  const { toast } = useToast();
  const lastClickTime = useRef(0);

  const { data: nearbyStores = [], isLoading: loadingNearbyStores } =
    useNearbyStores(nearbyStoresRequest, enableNearbyQuery);

  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
      }
      setLocationLoading(false);
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoFindStores = urlParams.get('autoFindStores');
    
    if (autoFindStores === 'true' && brand?.BrandCode && !hasSearched) {
      const timer = setTimeout(() => {
        handleFindNearbyStores();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [brand?.BrandCode, hasSearched]);

  const handleFindNearbyStores = async () => {
    if (!brand?.BrandCode) {
      toast({
        title: "Error",
        description: "Brand information not available",
      });
      return;
    }

    setHasSearched(false);
    setStoreSearchQuery("");

    let location = userLocation;
    if (!location) {
      setLocationLoading(true);
      location = await getUserLocation();
      setLocationLoading(false);

      if (location) {
        setUserLocation(location);
      }
    }

    if (!location) {
      toast({
        title: "Location Access Required",
        description: "Please enable location access to find nearby stores",
      });
      return;
    }

    setNearbyStoresRequest({
      lat: location.lat,
      lng: location.lng,
      brandCode: brand.BrandCode,
    });
    setEnableNearbyQuery(true);
    setHasSearched(true);
  };

  const filteredStores = useMemo(() => {
    if (!storeSearchQuery.trim()) return nearbyStores;

    const query = storeSearchQuery.toLowerCase();
    return nearbyStores.filter(
      (store) =>
        store.address?.toLowerCase().includes(query) ||
        store.city?.toLowerCase().includes(query) ||
        store.state?.toLowerCase().includes(query)
    );
  }, [nearbyStores, storeSearchQuery]);

  const requestedAmount = useMemo(() => {
    return amount && !isNaN(Number(amount)) ? Number(amount) * quantity : 0;
  }, [amount, quantity]);

const cashbackCalculation = useMemo(() => {
  if (!amount || !brand?.Discount) {
    return { 
      points: 0, 
      percentage: 0, 
      totalAmount: 0  // ✅ Add this!
    };
  }
  
  const totalAmount = Number(amount) * quantity;
  const cashbackPercent = brand.Discount / 100;
  const points = Math.round(totalAmount * cashbackPercent);
  
  return {
    points,
    percentage: brand.Discount,
    totalAmount
  };
}, [amount, quantity, brand?.Discount]);





  const brandCartTotal = useMemo(() => {
    if (!brand || !cart) return 0;
    return cart.items
      .filter((item) => item.brandId === brand.BrandId)
      .reduce((total, item) => total + item.lineTotal, 0);
  }, [brand, cart]);

  const checkGuardRailLimit = useMemo(() => {
    if (!isAuthenticated || !brandGuardRail || !amount) {
      return { exceeded: false, remaining: 0 };
    }

    const totalAfterPurchase = currentUsage + brandCartTotal + requestedAmount;
    const exceeded = totalAfterPurchase > brandGuardRail.monthlyLimit;
    const remaining = Math.max(
      0,
      brandGuardRail.monthlyLimit - (currentUsage + brandCartTotal)
    );

    return { exceeded, remaining };
  }, [
    isAuthenticated,
    brandGuardRail,
    currentUsage,
    requestedAmount,
    amount,
    brandCartTotal,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function loadImage() {
      if (!brand || !brand.Images) {
        if (isMounted) setImgSrc(FALLBACK);
        return;
      }

      const rawImage =
        brand.Images.text ||
        brand.Images.thumbnail ||
        brand.Images.featured ||
        brand.Images.mobile ||
        brand.Images.base ||
        brand.Images.small ||
        brand.Images.raw ||
        null;

      if (!rawImage) {
        if (isMounted) setImgSrc(FALLBACK);
        return;
      }

      const validated = await validateImage(rawImage);
      if (isMounted) setImgSrc(validated);
    }

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [brand]);

  useEffect(() => {
    if (
      brand &&
      brand.BrandType?.toLowerCase() === "fixed" &&
      brand.DenominationList?.length > 0
    ) {
      setAmount(brand.DenominationList[0].toString());
    }
  }, [brand]);

  useEffect(() => {
    setGuardRailExceeded(checkGuardRailLimit.exceeded);
  }, [checkGuardRailLimit.exceeded]);

  // Trigger celebration when cashback changes
useEffect(() => {
  if (cashbackCalculation.points > 0) {
    setShowCelebration(true);
    
    couponControls.start({
      scale: 1.05,
      rotate: -2,
      transition: { duration: 0.2, type: "spring", bounce: 0.4 }
    }).then(() => {
      couponControls.start({
        scale: 1,
        rotate: 0,
        transition: { duration: 0.2, type: "spring", bounce: 0.4 }
      });
    });
    
    stampControls.set({ scale: 4, opacity: 0, rotate: -30 });
    stampControls.start({
      scale: 1,
      opacity: 1,
      rotate: -15,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 12
      }
    });
    
    const timer = setTimeout(() => setShowCelebration(false), 1500);
    return () => clearTimeout(timer);
  }
}, [cashbackCalculation.points, couponControls, stampControls]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Loading brand details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">
            Could not load brand details
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Please try again later
          </p>
          <Link href="/brands">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Go Back to Brands
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Brand Not Found
            </h1>
            <Link href="/brands">
              <button className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Go Back to Brands
              </button>
            </Link>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const minPrice = Number(brand.minPrice) || 0;
  const maxPrice = Number(brand.maxPrice) || 0;
  const isFixedType = brand.BrandType?.toLowerCase() === "fixed";
  const isVariableType = brand.BrandType?.toLowerCase() === "variable";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setAmount(v);

    if (!v) return setError("");

    const num = Number(v);
    if (isNaN(num)) return setError("Enter a valid number");
    if (num < minPrice) return setError(`Minimum amount is ₹${minPrice}`);
    if (num > maxPrice) return setError(`Maximum amount is ₹${maxPrice}`);

    setError("");
  };

const handleAmountButtonClick = (denomination: number) => {
  setAmount(denomination.toString());
  setError("");
};


  const isValidAmount = () => {
    if (!amount) return false;

    if (isFixedType) {
      return brand.DenominationList?.includes(Number(amount));
    }

    if (isVariableType) {
      return (
        !error && Number(amount) >= minPrice && Number(amount) <= maxPrice
      );
    }

    return false;
  };

  const handleAddToCart = () => {
    if (!isValidAmount || guardRailExceeded) return;

    const now = Date.now();
    if (now - lastClickTime.current < 800) return;
    lastClickTime.current = now;

    addToCart({
      brandId: brand.BrandId,
      brandName: brand.BrandName,
      quantity: quantity,
      unitValue: Number(amount),
      image: imgSrc !== FALLBACK ? imgSrc : undefined,
    });

    toast({
      title: isAuthenticated ? "Added to Cart" : "Added to Cart (Guest)",
      description: isAuthenticated
        ? `${quantity}x ${brand.BrandName} voucher(s) of ₹${amount} each added to cart`
        : `${quantity}x ${brand.BrandName} voucher(s) saved. Login to checkout.`,
    });

    setQuantity(1);
    if (isVariableType) {
      setAmount("");
    }
  };

  const handleLimitExceeded = (exceeded: boolean) => {
    setGuardRailExceeded(exceeded);
  };

  const openModal = (tab: ModalTab) => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const hasRedeemSteps = brand.RedeemSteps && brand.RedeemSteps.length > 0;
  const hasInstructions = brand.ImportantInstruction && Object.keys(brand.ImportantInstruction).length > 0;
  const hasTerms = brand.Tnc;
  const hasAbout = brand.Description;

  const shouldShowInfoButtons = hasRedeemSteps || hasInstructions || hasTerms || hasAbout;

return (
  <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">

      <Header />

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">

          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] sm:max-h-[90vh] flex flex-col border border-border overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3 border-b border-border">
              <h2 className="text-base sm:text-lg font-bold">Brand Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

{/* Modal Tabs - Sticky with Enhanced Active State */}
<div className="sticky top-0 z-10 flex overflow-x-auto border-b-2 border-border/80 bg-card/95 backdrop-blur-md scrollbar-hide shadow-sm">
  {hasAbout && (
    <button onClick={() => setActiveTab("about")} className={`flex-1 basis-0 py-2 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === "about" ? "text-primary border-b-[3px] border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
      <Info className="w-4 h-4" />
      <span className="hidden sm:inline">About</span>
      <span className="sm:hidden">About</span>
    </button>
  )}
  
{hasRedeemSteps && (
  <button onClick={() => setActiveTab("redeem")} className={`flex-1 basis-0 py-2 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === "redeem" ? "text-primary border-b-[3px] border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
    <BookOpen className="w-4 h-4" />
    <span className="whitespace-nowrap">Redeem Steps</span>
  </button>
)}

  
  {hasInstructions && (
    <button onClick={() => setActiveTab("instructions")} className={`flex-1 basis-0 py-2 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === "instructions" ? "text-primary border-b-[3px] border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
      <AlertTriangle className="w-4 h-4" />
      <span className="hidden sm:inline">Instructions</span>
      <span className="sm:hidden">Info</span>
    </button>
  )}
  
  {hasTerms && (
    <button onClick={() => setActiveTab("terms")} className={`flex-1 basis-0 py-2 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === "terms" ? "text-primary border-b-[3px] border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
      <FileText className="w-4 h-4" />
      <span className="hidden sm:inline">Terms & Conditions</span>
      <span className="sm:hidden whitespace-nowrap">T & C</span>
    </button>
  )}
</div>


            {/* Modal Content */}
<div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 min-h-0 scroll-smooth">

              {activeTab === "about" && hasAbout && (
  <div className="space-y-3 sm:space-y-4">
    <h3 className="text-lg sm:text-xl font-bold">About</h3>
    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-none">
      {brand.Description}
    </p>
  </div>
)}
              {activeTab === "redeem" && hasRedeemSteps && (
                <div className="space-y-4 sm:space-y-5">
                  <h3 className="text-lg sm:text-xl font-bold">How to Redeem</h3>
                  
                  {/* Mobile: Single Column Cards */}
                  <div className="flex flex-col gap-4 sm:hidden">
                    {brand.RedeemSteps.map((step, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30 border border-border/50 space-y-3"
                      >
                        {step.image ? (
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-16 h-16 object-cover rounded-lg border border-border shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20 text-base shadow-sm">
                            {i + 1}
                          </div>
                        )}
                        <div className="max-w-[280px]">
                          <p className="text-sm font-semibold text-foreground leading-relaxed">{step.title}</p>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Grid Layout */}
                  <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {brand.RedeemSteps.map((step, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center space-y-3"
                      >
                        {step.image ? (
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg border border-border"
                          />
                        ) : (
                          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-lg lg:text-xl">
                            {i + 1}
                          </div>
                        )}
                        <p className="text-base lg:text-lg font-medium">{step.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "instructions" && hasInstructions && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold">Important Instructions</h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {Object.values(brand.ImportantInstruction).map((inst, i) => (
                      <li key={i} className="flex gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg p-3 sm:p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-800/30 overflow-hidden">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full bg-amber-200 dark:bg-amber-900/50 flex items-center justify-center font-bold text-amber-800 dark:text-amber-300 text-base shadow-sm">
                          !
                        </span>
                        <span className="flex-1 min-w-0 text-foreground leading-relaxed pt-0.5 break-words">
                          <TextWithLineBreaks text={inst} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "terms" && hasTerms && (
                <div className="space-y-1.5 sm:space-y-2 max-w-4xl">
                  <h3 className="text-xs sm:text-sm font-semibold">Terms & Conditions</h3>
                  
                  {/* Quick Summary Card */}
                  <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary rounded-lg p-1.5 space-y-0 overflow-hidden">
                    <div className="flex items-start gap-1">
                      <FileText className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-0 flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-foreground mb-0.5">Key Highlights</p>
                        <ul className="space-y-0 text-[10px] text-muted-foreground">
                          <li className="flex items-center gap-1">
                            <span className="w-0.5 h-0.5 rounded-full bg-primary flex-shrink-0"></span>
                            <span className="flex-1"><strong className="text-foreground">Validity:</strong> Check expiry before use</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="w-0.5 h-0.5 rounded-full bg-primary flex-shrink-0"></span>
                            <span className="flex-1"><strong className="text-foreground">Usage:</strong> One voucher per transaction</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="w-0.5 h-0.5 rounded-full bg-primary flex-shrink-0"></span>
                            <span className="flex-1"><strong className="text-foreground">Non-refundable:</strong> Cannot be exchanged for cash</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Terms List */}
                  <ul className="space-y-1 px-1">
                    {typeof brand.Tnc === "object" &&
                      !Array.isArray(brand.Tnc) &&
                      Object.values(brand.Tnc as Record<string, string>).map(
                        (t, i) => {
                          // Remove leading numbers and enhance with bold keywords
                          const cleanText = t.replace(/^\d+\.\s*/, '');
                          const enhancedText = cleanText
                            .replace(/(\d+\s*months?|\d+\s*years?|expiry|validity|valid)/gi, '<strong>$1</strong>')
                            .replace(/(one voucher per|not valid|cannot be|non-refundable|digital voucher)/gi, '<strong>$1</strong>')
                            .replace(/(31st? december|discount|cash)/gi, '<strong>$1</strong>');
                          
                          return (
                            <li key={i} className="flex gap-1 items-start">
                              <span className="w-3.5 h-3.5 flex-shrink-0 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[8px] font-semibold flex items-center justify-center mt-0.5 shadow-sm">
                                {i + 1}
                              </span>
                              <div className="flex-1 min-w-0 pl-0">
                                <span 
                                  className="text-[11px] leading-[1.3] text-foreground/90 dark:text-foreground/85 block break-words"
                                  dangerouslySetInnerHTML={{ __html: enhancedText }}
                                />
                              </div>
                            </li>
                          );
                        }
                      )}

                    {typeof brand.Tnc === "string" &&
                      (() => {
                        let cleanedTnc = brand.Tnc.trim();
                        if (cleanedTnc.startsWith('{"text":"')) {
                          cleanedTnc = cleanedTnc
                            .replace(/^\{"text":"/, "")
                            .replace(/"\}$/, "");
                        }

                        const points = cleanedTnc
                          .split(/\.(?=\s*\d)/)
                          .map((p) => p.trim())
                          .filter((p) => p.length > 0)
                          .map((p) => {
                            // Remove leading numbers
                            const cleaned = p.replace(/^\d+\.\s*/, '');
                            // Add period if missing
                            return cleaned.endsWith(".") ? cleaned : cleaned + ".";
                          });

                        return points.map((point, i) => {
                          // Enhance with bold keywords
                          const enhancedPoint = point
                            .replace(/(\d+\s*months?|\d+\s*years?|expiry|validity|valid)/gi, '<strong>$1</strong>')
                            .replace(/(one voucher per|not valid|cannot be|non-refundable|digital voucher)/gi, '<strong>$1</strong>')
                            .replace(/(31st? december|discount|cash|bill)/gi, '<strong>$1</strong>');

                          return (
                            <li key={i} className="flex gap-1 items-start">
                              <span className="w-3.5 h-3.5 flex-shrink-0 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[8px] font-semibold flex items-center justify-center mt-0.5 shadow-sm">
                                {i + 1}
                              </span>
                              <div className="flex-1 min-w-0 pl-0">
                                <span 
                                  className="text-[11px] leading-[1.3] text-foreground/90 dark:text-foreground/85 block break-words"
                                  dangerouslySetInnerHTML={{ __html: enhancedPoint }}
                                />
                              </div>
                            </li>
                          );
                        });
                      })()}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Floating Purchase Button */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
        <button
          disabled={!isValidAmount() || guardRailExceeded}
          onClick={handleAddToCart}
          className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg pointer-events-auto transition-all ${
            isValidAmount() && !guardRailExceeded
              ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {guardRailExceeded
            ? "Limit Exceeded"
            : isValidAmount()
            ? `Add ₹${(Number(amount) * quantity).toLocaleString()}`
            : "Add to Cart"}
        </button>
      </div>

<main className="flex-1 pb-20 md:pb-0 w-full">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

          {/* Back Button */}
          <Link href="/brands">
            <button className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors text-sm font-medium group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Brands</span>
              <span className="sm:hidden">Back</span>
            </button>
          </Link>

          <div className="grid lg:grid-cols-[1fr,400px] gap-6 lg:gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Brand Card */}
<section className="bg-card rounded-xl border border-border shadow-sm">
  <div className="p-3 sm:p-4 md:p-6">

                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted/30 rounded-xl flex items-center justify-center border border-border flex-shrink-0 p-3">
                      <img
                        src={imgSrc}
                        alt={brand.BrandName}
                        className="w-full h-full object-contain"
                        onError={() => {
                          console.error("Image failed for:", brand.BrandName);
                          setImgSrc(FALLBACK);
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl font-bold mb-2 break-words">
                        {brand.BrandName}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2">
                        {brand.Category && (
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs sm:text-sm">
                            {brand.Category}
                          </span>
                        )}
                        {brand?.Discount && brand.Discount > 0 && (
                          <span className="inline-flex items-center gap-1 bg-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {brand.Discount.toFixed(1)}% Cashback
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="hidden md:block bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 text-sm sm:text-base font-semibold">
                  <Info className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                  <span>About</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {brand.Description}
                </p>
              </section>

                                          {/* Mobile Purchase Section */}
              <section className="md:hidden bg-card rounded-xl border border-border shadow-sm p-3 sm:p-4">

                <h2 className="text-lg sm:text-xl font-bold mb-4">Purchase Details</h2>

                {isFixedType && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a denomination
                  </p>
                )}
                {isVariableType && (
                  <p className="text-sm text-muted-foreground mb-4">
                    ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                  </p>
                )}

                {isAuthenticated && brandGuardRail && (
                  <BrandGuardRailStatus
                    brandGuardRail={brandGuardRail}
                    currentUsage={currentUsage + brandCartTotal}
                    requestedAmount={requestedAmount}
                    onLimitExceeded={handleLimitExceeded}
                    isAuthenticated={isAuthenticated}
                  />
                )}

{isFixedType && (
  <div className="mb-4">
    {/* Denomination Buttons */}
    <div className="flex flex-wrap gap-2 sm:gap-3 -mx-0.5">


      {brand.DenominationList && brand.DenominationList.length > 0 ? (
        brand.DenominationList.map((denomination, index) => (
          <button
            key={`denomination-${index}`}
            onClick={() => handleAmountButtonClick(denomination)}
            className={`
              flex-shrink-0 px-2.5 sm:px-4 py-0.5 sm:py-0.5 rounded-lg sm:rounded-xl
              text-sm sm:text-base font-semibold
              border-2 transition-all duration-200
              ${
                Number(amount) === denomination
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-background text-foreground border-border hover:border-primary hover:bg-accent"
              }
            `}
          >
            ₹{denomination.toLocaleString()}
          </button>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No denominations available</p>
      )}
    </div>
  </div>
)}


                {isVariableType && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold block mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={`${minPrice} - ${maxPrice}`}
                        className={`w-full h-11 sm:h-12 pl-8 pr-4 text-sm sm:text-base border rounded-lg bg-background outline-none transition-all ${
                          error
                            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : isValidAmount()
                            ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>
                    
                    {/* Price Slider - Enhanced UX */}
                    <div className="mt-4 px-1">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}
                        onChange={(e) => {
                          const sliderValue = Number(e.target.value);
                          const mappedAmount = mapSliderToAmount(sliderValue, minPrice, maxPrice);
                          setAmount(mappedAmount.toString());
                          setError("");
                        }}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}%, hsl(var(--border)) ${mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}%, hsl(var(--border)) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>₹{minPrice.toLocaleString()}</span>
                        <span>₹{maxPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm mt-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Quantity
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="flex-1 h-10 sm:h-11 rounded-lg border border-border text-center font-semibold text-base bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

{isValidAmount() && !guardRailExceeded && (
  <motion.div 
    animate={couponControls}
    className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-primary/30 shadow-lg overflow-hidden mb-4"
  >
    {/* Confetti Animation */}
    <AnimatePresence>
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: "50%", 
                y: "50%", 
                scale: 0, 
                rotate: 0 
              }}
              animate={{ 
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0.8, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 1, 
                delay: i * 0.05 
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 4]
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>

    <div className="p-4">
      {/* Card Header */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex justify-between">
        {/* <span>CARD: **** **** **** {String(Math.random()).slice(2, 6)}</span>
        <span>PIN: ***</span> */}
      </div>

      {/* Total Amount */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">TOTAL AMOUNT</div>
        <motion.div 
          key={cashbackCalculation.totalAmount}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white"
        >
          ₹{cashbackCalculation.totalAmount.toLocaleString()}
        </motion.div>
      </div>

      {/* Separator */}
      <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3"></div>

      {/* Cashback Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                CASHBACK EARNED
              </div>
              <motion.div 
                key={cashbackCalculation.points}
                initial={{ scale: 1.3, color: "#10b981" }}
                animate={{ scale: 1, color: "#059669" }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-2xl font-black text-emerald-600 dark:text-emerald-400"
              >
                {cashbackCalculation.points}
                <span className="text-sm font-medium ml-1">Points</span>
              </motion.div>
            </div>
          </div>

          {/* Percentage Stamp */}
          <motion.div
            animate={stampControls}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 bg-emerald-100 dark:bg-emerald-900 flex flex-col items-center justify-center rotate-12 shadow-lg">
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                {cashbackCalculation.percentage}%
              </div>
              <div className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                CASHBACK
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sparkle Effect */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          className="absolute -right-4 -top-4 text-emerald-300 dark:text-emerald-600"
        >
          <Sparkles className="h-12 w-12" />
        </motion.div>
      </div>
    </div>
  </motion.div>
)}

              </section>

{/* Info Buttons Section */}
{shouldShowInfoButtons && (
  <section className="bg-card rounded-xl border border-border shadow-sm p-2.5 sm:p-6">
    <div className="flex gap-0.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center">
      {/* About Button - Mobile Only */}
      {hasAbout && (
        <button
          onClick={() => openModal("about")}
          className="flex-shrink-0 flex items-center justify-center gap-0.5 sm:gap-1.5 py-1 px-1.5 sm:px-3 rounded-md border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all text-2xs sm:text-sm font-medium md:hidden"
        >
          <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <span>About</span>
        </button>
      )}

      {/* Redeem Button - Redeem Steps on all screens */}
      {hasRedeemSteps && (
        <button
          onClick={() => openModal("redeem")}
          className="flex-shrink-0 flex items-center justify-center gap-0.5 sm:gap-1.5 py-1 px-1.5 sm:px-3 rounded-md border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all text-2xs sm:text-sm font-medium whitespace-nowrap"
        >
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <span>Redeem Steps</span>
        </button>
      )}

      {/* Instructions Button */}
      {hasInstructions && (
        <button
          onClick={() => openModal("instructions")}
          className="flex-shrink-0 flex items-center justify-center gap-0.5 sm:gap-1.5 py-1 px-1.5 sm:px-3 rounded-md border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all text-2xs sm:text-sm font-medium whitespace-nowrap"
        >
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
          <span className="sm:hidden">Info</span>
          <span className="hidden sm:inline">Important Instructions</span>
        </button>
      )}

      {/* T & C Button */}
      {hasTerms && (
        <button
          onClick={() => openModal("terms")}
          className="flex-shrink-0 flex items-center justify-center gap-0.5 sm:gap-1.5 py-1 px-1.5 sm:px-3 rounded-md border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all text-2xs sm:text-sm font-medium whitespace-nowrap"
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          <span className="sm:hidden">T & C</span>
          <span className="hidden sm:inline">Terms & Conditions</span>
        </button>
      )}
    </div>
  </section>
)}







              {/* Nearby Stores Section */}
              <section className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                      <MapPin className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Nearby Stores</span>
                    </div>
                    {nearbyStores.length > 0 && (
                      <span className="text-xs sm:text-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {nearbyStores.length}
                      </span>
                    )}
                  </div>

                  {!hasSearched && !loadingNearbyStores && (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Store className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        Find stores near your location
                      </p>
                      <button
                        onClick={handleFindNearbyStores}
                        disabled={loadingNearbyStores || locationLoading}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {locationLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="h-4 w-4" />
                            <span>Find Stores</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {loadingNearbyStores && (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="relative mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Finding stores...
                      </p>
                    </div>
                  )}

                  {hasSearched &&
                    !loadingNearbyStores &&
                    nearbyStores.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-base sm:text-lg text-foreground mb-2">
                          No stores nearby
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground mb-5">
                          No stores within 100 km
                        </p>
                        <button
                          onClick={handleFindNearbyStores}
                          className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1.5"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Try Again
                        </button>
                      </div>
                    )}

                  {hasSearched &&
                    !loadingNearbyStores &&
                    nearbyStores.length > 0 && (
                      <div className="space-y-4">
                        <div className="relative">
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search stores..."
                            value={storeSearchQuery}
                            onChange={(e) => setStoreSearchQuery(e.target.value)}
                            className="w-full h-10 sm:h-11 pl-10 pr-4 text-sm sm:text-base border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
                          {filteredStores.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-sm sm:text-base text-muted-foreground">
                                No stores match your search
                              </p>
                            </div>
                          ) : (
                            filteredStores.map((store) => (
                              <div
                                key={store.storeId}
                                className="border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/50 transition-all"
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm sm:text-base mb-1 truncate">
                                      {store.city}
                                      {store.state && `, ${store.state}`}
                                    </h4>
                                    {store.address && (
                                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
                                        {store.address}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold flex-shrink-0 whitespace-nowrap">
                                    <MapPin className="h-3 w-3" />
                                    {store.distanceKm.toFixed(1)} Km
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    window.open(
                                      `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`,
                                      "_blank"
                                    )
                                  }
                                  className="w-full h-9 sm:h-10 rounded-lg bg-primary/10 text-primary text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span>Directions</span>
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </section>


            </div>

            {/* RIGHT COLUMN - Desktop Purchase */}
            <div className="hidden md:block lg:sticky lg:top-6 lg:self-start">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-1">Purchase Voucher</h2>

                {isFixedType && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Select a denomination from the list
                  </p>
                )}
                {isVariableType && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter an amount between ₹{minPrice.toLocaleString()} and ₹{maxPrice.toLocaleString()}
                  </p>
                )}

                {isAuthenticated && brandGuardRail && (
                  <BrandGuardRailStatus
                    brandGuardRail={brandGuardRail}
                    currentUsage={currentUsage + brandCartTotal}
                    requestedAmount={requestedAmount}
                    onLimitExceeded={handleLimitExceeded}
                    isAuthenticated={isAuthenticated}
                  />
                )}

{isFixedType && (
  <div className="mb-6">
    {/* Denomination Buttons */}
    <div className="flex flex-wrap gap-3">

      {brand.DenominationList && brand.DenominationList.length > 0 ? (
        brand.DenominationList.map((denomination, index) => (
          <button
            key={`denomination-desktop-${index}`}
            onClick={() => handleAmountButtonClick(denomination)}
            className={`
              flex-shrink-0 px-2.5 py-0.5 rounded-xl
              text-base font-semibold
              border-2 transition-all duration-200
              ${
                Number(amount) === denomination
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-background text-foreground border-border hover:border-primary hover:bg-accent"
              }
            `}
          >
            ₹{denomination.toLocaleString()}
          </button>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No denominations available</p>
      )}
    </div>
  </div>
)}


                {isVariableType && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold block mb-2">
                      Enter Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={`${minPrice} - ${maxPrice}`}
                        className={`w-full h-12 pl-8 pr-4 text-base border rounded-lg bg-background outline-none transition-all ${
                          error
                            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : isValidAmount()
                            ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>
                    
                    {/* Price Slider - Enhanced UX */}
                    <div className="mt-4 px-1">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}
                        onChange={(e) => {
                          const sliderValue = Number(e.target.value);
                          const mappedAmount = mapSliderToAmount(sliderValue, minPrice, maxPrice);
                          setAmount(mappedAmount.toString());
                          setError("");
                        }}
                        className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}%, hsl(var(--border)) ${mapAmountToSlider(Number(amount) || minPrice, minPrice, maxPrice)}%, hsl(var(--border)) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>₹{minPrice.toLocaleString()}</span>
                        <span>₹{maxPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm mt-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Quantity
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="flex-1 h-11 rounded-lg border border-border text-center font-semibold text-base bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

{isValidAmount() && !guardRailExceeded && (
  <motion.div 
    animate={couponControls}
    className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-primary/30 shadow-lg overflow-hidden mb-6"
  >
    {/* Confetti Animation */}
    <AnimatePresence>
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: "50%", 
                y: "50%", 
                scale: 0, 
                rotate: 0 
              }}
              animate={{ 
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1.5, 1, 0],
                rotate: Math.random() * 720
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.04 
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 4]
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>

    <div className="p-6">
      {/* Card Header */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex justify-between">
        {/* <span>CARD: **** **** **** {String(Math.random()).slice(2, 6)}</span>
        <span>PIN: ***</span> */}
      </div>

      {/* Total Amount */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">TOTAL AMOUNT</div>
        <motion.div 
          key={cashbackCalculation.totalAmount}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black text-gray-900 dark:text-white"
        >
          ₹{cashbackCalculation.totalAmount.toLocaleString()}
        </motion.div>
      </div>

      {/* Separator */}
      <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4"></div>

      {/* Cashback Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                CASHBACK EARNED
              </div>
              <motion.div 
                key={cashbackCalculation.points}
                initial={{ scale: 1.3, color: "#10b981" }}
                animate={{ scale: 1, color: "#059669" }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-3xl font-black text-emerald-600 dark:text-emerald-400"
              >
                {cashbackCalculation.points}
                <span className="text-base font-medium ml-1">Points</span>
              </motion.div>
            </div>
          </div>

          {/* Percentage Stamp */}
          <motion.div
            animate={stampControls}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-emerald-100 dark:bg-emerald-900 flex flex-col items-center justify-center rotate-12 shadow-lg">
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {cashbackCalculation.percentage}%
              </div>
              <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                CASHBACK
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sparkle Effect */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          className="absolute -right-4 -top-4 text-emerald-300 dark:text-emerald-600"
        >
          <Sparkles className="h-16 w-16" />
        </motion.div>
      </div>
    </div>
  </motion.div>
)}


                <button
                  disabled={!isValidAmount() || guardRailExceeded}
                  onClick={handleAddToCart}
                  className={`w-full h-12 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition-all ${
                    isValidAmount() && !guardRailExceeded
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {guardRailExceeded ? "Limit Exceeded" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}