import { useState, useEffect, useRef } from "react";
import { X, Plus, Minus, ShoppingCart, ChevronDown, Loader2 } from "lucide-react";
import type { Brand } from "@/types/brand";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useBrandDetails } from "@/hooks/useBrandDetails";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useGeneratePaymentToken } from "@/hooks/useGeneratePaymentToken";
import { useValidateOrder } from "@/hooks/useValidateOrder";
import { encrypt } from "@/utils/encryption";
import { useEasebuzzScript } from "@/hooks/useEasebuzzScript";
import { useEasebuzzInitiatePayment } from "@/hooks/useEasebuzzInitiatePayment";


interface QuickBuyModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
  brandImage: string;
}

export default function QuickBuyModal({
  brand,
  isOpen,
  onClose,
  brandImage,
}: QuickBuyModalProps) {
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const lastClickTime = useRef<number>(0);

  const { user } = useAuthContext();
  const { addToCart } = useCart(user?.clientId);
  const { toast } = useToast();
const createOrderMutation = useCreateOrder();
const generateTokenMutation = useGeneratePaymentToken();
  const easebuzzPaymentMutation = useEasebuzzInitiatePayment();
const validateOrderMutation = useValidateOrder();
  const easebuzzScriptStatus = useEasebuzzScript();

const { data: brandDetails, isLoading } = useBrandDetails(brand.BrandId, {
  enabled: isOpen, // ✅ Only fetch when modal is open
});

const minPrice = brandDetails?.minPrice || 0;
const maxPrice = brandDetails?.maxPrice || 0;
const isFixedType = brandDetails?.BrandType?.toLowerCase() === "fixed";
const isVariableType = brandDetails?.BrandType?.toLowerCase() === "variable";

  // Initialize amount for fixed type
  useEffect(() => {
if (isFixedType && brandDetails?.DenominationList?.length > 0) {
  setAmount(brandDetails.DenominationList[0].toString());
}
  }, [isFixedType, brandDetails?.DenominationList]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmount(e.target.value);
    setError("");
  };

  const isValidAmount = () => {
    if (!amount) return false;
    if (isFixedType) {
      return brandDetails?.DenominationList?.includes(Number(amount));
    }
    if (isVariableType) {
      return !error && Number(amount) >= minPrice && Number(amount) <= maxPrice;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (!isValidAmount()) {
      toast({
        title: "Invalid amount",
        description: isVariableType
          ? `Enter an amount between ₹${minPrice} and ₹${maxPrice}`
          : "Select a valid denomination to continue.",
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();
    if (now - lastClickTime.current < 800) return;
    lastClickTime.current = now;

    addToCart({
      brandId: brand.BrandId,
      brandName: brand.BrandName,
      quantity: quantity,
      unitValue: Number(amount),
      image: brandImage,
    });

    toast({
      title: user?.clientId ? "Added to Cart" : "Added to Cart (Guest)",
      description: user?.clientId
        ? `${quantity}x ${brand.BrandName} voucher(s) of ₹${amount} each added to cart`
        : `${quantity}x ${brand.BrandName} voucher(s) saved. Login to checkout.`,
    });

    setQuantity(1);
    if (isVariableType) {
      setAmount("");
    }
  };

const handlePayNow = async () => {
  if (!isValidAmount()) {
    toast({
      title: "Invalid amount",
      description: isVariableType
        ? `Enter an amount between ₹${minPrice} and ₹${maxPrice}`
        : "Select a valid denomination to continue.",
      variant: "destructive",
    });
    return;
  }

  if (isProcessing) {
    return;
  }

  if (easebuzzScriptStatus !== "ready") {
    toast({
      title: "Payment system loading",
      description: "Please wait a moment and try again.",
      variant: "destructive",
    });
    return;
  }

  // Check if cart has items
//   if (cart && cart.items && cart.items.length > 0) {
//     toast({
//       title: "Cart Not Empty",
//       description: "Please empty your cart before making a quick purchase.",
//       variant: "destructive",
//     });
//     return;
//   }

  if (!user?.clientId) {
    toast({
      title: "Error",
      description: "User client ID not found. Please login again.",
      variant: "destructive",
    });
    return;
  }

  // Generate orderNumber exactly like useCart does
  const today = new Date();
  const yymmdd =
    today.getFullYear().toString().slice(-2) +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");
  const uuid = window.crypto.randomUUID();
  const orderNumber = "ORD" + yymmdd + uuid.replace(/-/g, "").slice(0, 12).toUpperCase();

  const totalAmount = Number(amount) * quantity;

  // Create order request with ALL required fields
// Create order request with ALL required fields
const orderRequest = {
  order: {
    clientId: user.clientId,
    orderNumber: orderNumber,
    totalAmount: totalAmount,
    currency: "INR",
    status: "PENDING",
    walletUsed: false,     // ✅ ADD THIS
    walletAmount: 0.0,     // ✅ ADD THIS
  },
  items: [
    {
      brandId: brand.BrandId,
      quantity: quantity,
      unitValue: Number(amount),
      lineTotal: totalAmount,
      meta: "{}",
    },
  ],
};


  console.log("Creating quick buy order:", orderRequest);

  // Step 1: Create order in database
  createOrderMutation.mutate(orderRequest, {
    onSuccess: (orderResponse) => {
      console.log("Order created successfully:", orderResponse);
      // Use the orderNumber we generated
      validateOrder(orderNumber, totalAmount);
    },
    onError: (error: any) => {
      console.error("Order creation error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to create order. Please try again.";
      
      if (error && typeof error === "object") {
        if ("response" in error && error.response && typeof error.response === "object") {
          if ("data" in error.response && error.response.data && typeof error.response.data === "object") {
            if ("message" in error.response.data && typeof error.response.data.message === "string") {
              errorMessage = error.response.data.message;
            } else if (typeof error.response.data === "string") {
              errorMessage = error.response.data;
            }
          }
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Order creation failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};


const validateOrder = (orderNumber: string, totalAmount: number) => {
  console.log("Validating order:", orderNumber);
  validateOrderMutation.mutate(
    {
      orderNumber: orderNumber,
      cartTotal: totalAmount,
      walletAmount: 0,
      walletUsed: false,
    },
    {
      onSuccess: (validationResponse) => {
        console.log("Validation response:", validationResponse);
        if (!validationResponse.valid) {
          toast({
            title: "Validation Failed",
            description: validationResponse.message,
            variant: "destructive",
          });
          return;
        }
        console.log("Payment required. Amount:", validationResponse.amountToPay);
        generatePaymentToken(validationResponse.amountToPay, orderNumber);
      },
      onError: (error: any) => {
        console.error("Validation error:", error);
        toast({
          title: "Validation Failed",
          description: error.message || "Failed to validate order. Please try again.",
          variant: "destructive",
        });
      },
    }
  );
};

const generatePaymentToken = (amount: number, orderNumber: string) => {
  console.log("Generating payment token for order:", orderNumber);
  generateTokenMutation.mutate(orderNumber, {
    onSuccess: (tokenResponse) => {
      console.log("Payment token generated successfully:", tokenResponse);
      
      if (!tokenResponse.sabbpe_token) {
        toast({
          title: "Token generation failed",
          description: tokenResponse.message || "Failed to generate payment token.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Token Generated",
        description: "Payment token generated successfully.",
      });
      initiateEasebuzzPayment(amount, orderNumber, tokenResponse.sabbpe_token);
    },
    onError: (error: any) => {
      console.error("Token generation error:", error);
      toast({
        title: "Token generation failed",
        description: "Failed to generate payment token. Please try again.",
        variant: "destructive",
      });
    },
  });
};

const initiateEasebuzzPayment = async (amount: number, orderNumber: string, token: string) => {
  console.log("Initiating payment with token:", token);

  if (easebuzzScriptStatus !== "ready") {
    toast({
      title: "Payment system loading",
      description: "Please wait a moment and try again.",
      variant: "destructive",
    });
    return;
  }

  if (!user?.clientId) {
    toast({
      title: "Error",
      description: "User information missing. Please login again.",
      variant: "destructive",
    });
    return;
  }

  const encryptedOrderRef = await encrypt(`${orderNumber}|${user.clientId}`);
  const sabbpeFrontendUrl = import.meta.env.VITE_SABBPE_FRONTEND_URL || window.location.hostname;

  const paymentRequest = {
    sabbpe_token: token,
    amount,
    productinfo: import.meta.env.VITE_SABBPE_PRODUCT_INFO || "Gift Voucher Purchase",
    frontend_url: sabbpeFrontendUrl,
    encrypted_order_ref: encryptedOrderRef,
    client_id: user.clientId,
    customer: {
      firstname: import.meta.env.VITE_PAYMENT_CUSTFIRSTNAME || user?.name || "Test",
      email: import.meta.env.VITE_PAYMENT_CUSTEMAIL || user?.email || "contact@sabbpe.com",
      phone: import.meta.env.VITE_PAYMENT_CUSTMOBILE || user?.mobile || "9876543210",
    },
  };

  easebuzzPaymentMutation.mutate(paymentRequest, {
    onSuccess: (response) => {
      console.log("Quick buy SabbPe response:", response);

      const isSuccess = response.status === 1 || response.status === true;
      if (!isSuccess) {
        toast({
          title: "Payment initiation failed",
          description:
            response.message ||
            "Unable to initiate payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const paymentUrl =
        response.payment_url ||
        (response as { paymentUrl?: string }).paymentUrl ||
        response.data;

      if (!paymentUrl) {
        toast({
          title: "Payment error",
          description: "Invalid payment response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      window.location.href = paymentUrl;
      onClose();
    },
    onError: (error: any) => {
      console.error("SabbPe initiate error:", error);
      toast({
        title: "Payment failed",
        description: "Failed to initiate SabbPe payment. Please try again.",
        variant: "destructive",
      });
    },
  });
};

const isProcessing =
  createOrderMutation.isPending ||
  validateOrderMutation.isPending ||
  generateTokenMutation.isPending ||
  easebuzzPaymentMutation.isPending;


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src={brandImage}
                alt={brand.BrandName}
                className="w-12 h-12 object-contain rounded-lg bg-muted/30"
              />
              <div>
                <h3 className="font-bold text-lg">{brand.BrandName}</h3>
                <p className="text-xs text-muted-foreground">Quick Buy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {isLoading ? (
  <div className="py-12 flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
) : (
  <>

            {/* Select Amount */}
            {isFixedType && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Select Amount
                </label>
                <div className="relative">
                  <select
                    value={amount}
                    onChange={handleDropdownChange}
                    className="w-full h-12 pl-4 pr-10 text-base border border-border rounded-lg outline-none transition-all bg-background appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {brandDetails?.DenominationList && brandDetails?.DenominationList.length > 0 ? (
                      brandDetails?.DenominationList.map((denomination, index) => (
                        <option key={`${denomination}-${index}`} value={denomination}>
                          ₹{denomination.toLocaleString()}
                        </option>
                      ))
                    ) : (
                      <option value="">No denominations available</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}

            {isVariableType && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={`${minPrice} - ${maxPrice}`}
                    className={`w-full h-12 pl-7 pr-4 text-base border rounded-lg outline-none transition-all bg-background ${
                      error
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isValidAmount()
                        ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                Quantity
                {brand?.Discount && Number(brand.Discount) > 0 && (
                  <span className="ml-auto flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                    ⭐ {Number(brand.Discount).toFixed(1)}% Cashback
                  </span>
                )}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 h-12 rounded-lg border border-border text-center font-semibold text-base bg-background"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total Amount */}
            {isValidAmount() && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(Number(amount) * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
              </>
)}

          </div>

{/* Footer */}
<div className="p-4 sm:p-6 border-t border-border">
  <div className="flex gap-3">
    <button
      onClick={handleAddToCart}
      className={`flex-1 h-12 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition-all border-2 ${
        isValidAmount()
          ? "border-primary text-primary hover:bg-primary/10"
          : "border-muted text-muted-foreground opacity-60 hover:bg-muted/40"
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      Add to Cart
    </button>
    <button
      disabled={isProcessing}
      onClick={handlePayNow}
      className={`flex-1 h-12 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition-all ${
        isValidAmount() && !isProcessing && easebuzzScriptStatus === "ready"
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          : "bg-muted text-muted-foreground opacity-60 hover:bg-muted/70"
      }`}
    >
      {easebuzzScriptStatus === "loading" && "Loading..."}
      {easebuzzScriptStatus === "error" && "Error"}
      {createOrderMutation.isPending && "Creating..."}
      {validateOrderMutation.isPending && "Validating..."}
      {generateTokenMutation.isPending && "Token..."}
      {easebuzzPaymentMutation.isPending && "Processing..."}
      {!isProcessing && easebuzzScriptStatus === "ready" && "Pay Now"}
    </button>
  </div>
</div>

        </div>
      </div>
    </>
  );
}
