// pages/PaymentResult.tsx - Professional Generic Payment Status
import { useEffect, useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { useFetchCoupons } from "@/hooks/useFetchCoupons";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { decrypt } from "@/utils/encryption";
import type { CouponItem } from "@/types/order";

export default function PaymentResult() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const updateStatusMutation = useUpdateOrderStatus();
  const fetchCouponsMutation = useFetchCoupons();

  const [loading, setLoading] = useState(true);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [orderStatusUpdateSuccess, setOrderStatusUpdateSuccess] = useState(false);
  const [couponsFetched, setCouponsFetched] = useState(false);
  const [decryptedOrderNumber, setDecryptedOrderNumber] = useState<string>("");
  const [decryptedClientId, setDecryptedClientId] = useState<string>("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [clientIdMismatch, setClientIdMismatch] = useState(false);
  
  // Use user?.clientId consistently for fetching orders - this is the authoritative source
  const ordersClientId = user?.clientId;
  const { data: ordersData } = useOrders(ordersClientId);

  // Parse params for BOTH gateways (NTT Data & Easebuzz)
  const paymentData = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    
    // NTT Data: ?txnId=ENCRYPTED (capital I)
    const nttTxnId = params.get("txnId");
    
    // Easebuzz: ?status=SUCCESS&txnid=ENCRYPTED (lowercase i)
    const easebuzzStatus = params.get("status");
    const easebuzzTxnId = params.get("txnid");
    
    const error = params.get("error");

    console.log("💳 Payment callback received:", {
      nttTxnId: nttTxnId ? "present" : "null",
      easebuzzStatus,
      easebuzzTxnId: easebuzzTxnId ? "present" : "null",
      error,
    });

    let status: "success" | "error" | "pending" = "error";
    let message = "";
    let encryptedTransactionId = "";
    let gateway: "ntt" | "easebuzz" = "ntt";

    // Easebuzz detection (has both status + txnid)
    if (easebuzzStatus && easebuzzTxnId) {
      gateway = "easebuzz";
      encryptedTransactionId = easebuzzTxnId;

      const statusLower = easebuzzStatus.toLowerCase();
      
      if (statusLower === "success") {
        status = "success";
        message = "Your payment has been processed successfully!";
      } else if (statusLower === "failure") {
        status = "error";
        message = "Payment could not be processed. Please try again.";
      } else if (statusLower === "usercancelled") {
        status = "error";
        message = "Payment was cancelled. You have not been charged.";
      } else if (statusLower === "pending") {
        status = "pending";
        message = "Your payment is being processed. This may take a few moments.";
      } else {
        status = "error";
        message = "Payment status could not be determined.";
      }
    }
    // NTT Data detection (only txnId with capital I)
    else if (nttTxnId) {
      gateway = "ntt";
      encryptedTransactionId = nttTxnId;
      status = "success";
      message = "Your payment has been processed successfully!";
    }
    // Error parameter
    else if (error) {
      status = "error";
      
      switch (error) {
        case "invalid_signature":
          message = "Payment verification failed. Please contact support.";
          break;
        case "invalid_transaction":
          message = "Invalid transaction. Please try again.";
          break;
        case "txn_not_found":
          message = "Transaction not found. Please contact support.";
          break;
        case "callback_processing_failed":
          message = "Payment processing error. Please contact support.";
          break;
        default:
          message = "Payment could not be completed. Please try again.";
      }
    }
    // No valid params
    else {
      status = "error";
      message = "Invalid payment response. Please contact support.";
    }

    return {
      status,
      message,
      encryptedTransactionId,
      gateway,
    };
  }, [searchParams]);

  // Decrypt transaction ID and extract order number + clientId
  useEffect(() => {
    const decryptTransactionId = async () => {
      if (paymentData.encryptedTransactionId) {
        try {
          const normalizedTxnId = (paymentData.encryptedTransactionId || "").trim().replace(/ /g, "+");
          const decrypted = await decrypt(normalizedTxnId);
          if (!decrypted || !decrypted.includes("|")) {
            throw new Error("Invalid decrypted payload");
          }
          const parts = decrypted.split("|");
          const orderNumber = parts[0]?.trim() || "";
          const clientIdFromToken = parts[1]?.trim() || "";
          if (!orderNumber) {
            throw new Error("Empty order number after decryption");
          }
          setDecryptedOrderNumber(orderNumber);
          setDecryptedClientId(clientIdFromToken);
          setIsDecrypted(true); // Mark decryption as successful
          
          // Validate clientId match - compare decrypted clientId with user clientId
          if (clientIdFromToken && user?.clientId && clientIdFromToken !== user.clientId) {
            console.warn("⚠️ Client ID mismatch detected!", {
              tokenClientId: clientIdFromToken,
              userClientId: user.clientId
            });
            setClientIdMismatch(true);
          } else {
            setClientIdMismatch(false);
          }
          
          console.log("✅ Order Number:", orderNumber);
          console.log("✅ Client ID from token:", clientIdFromToken);
          console.log("✅ User Client ID:", user?.clientId);
        } catch (error) {
          console.error("❌ Decryption failed:", error);
          // Do not show encrypted txnid as order number.
          // Show order number only when decryption succeeds.
          setDecryptedOrderNumber("");
          setDecryptedClientId("");
          setIsDecrypted(false); // Mark decryption as failed
        }
      }
    };

    decryptTransactionId();
  }, [paymentData.encryptedTransactionId]);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Update order status and fetch coupons
  // The payment result should always display regardless of auth status
  // API failures should NOT trigger redirects to login
  useEffect(() => {
    // Only update order status after decryption is complete OR if decryption failed but we have fallback data
    // This prevents race conditions where API is called before decryption finishes
    // The isDecrypted flag ensures we wait for the decryption attempt to complete
    const hasValidOrderNumber = isDecrypted || (!isDecrypted && decryptedOrderNumber);
    
    if (!loading && !statusUpdated && paymentData.encryptedTransactionId && hasValidOrderNumber) {
      const orderStatus = paymentData.status === "success" ? "PAID" : "FAILED";

      // Normalize Base64 before sending to backend (spaces from URL become +, URL-safe chars normalized)
      const normalizedEncryptedData = paymentData.encryptedTransactionId
        .trim()
        .replace(/ /g, "+")
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      // Send encrypted transaction ID to backend (do not decrypt)
      updateStatusMutation.mutate(
        {
          orderNumber: normalizedEncryptedData,
          status: orderStatus,
        },
        {
          onSuccess: (response) => {
            // Mark that status update was attempted (API call succeeded)
            setStatusUpdated(true);
            
            // Set flag to force refetch in orders page
            sessionStorage.setItem('justReturnedFromPayment', 'true');
            
            // onSuccess only runs for successful HTTP responses from the backend.
            const isUpdateSuccessful = true;
            setOrderStatusUpdateSuccess(true);
            
            console.log("📝 Order status update response:", response);
            console.log("📝 Order status update success:", isUpdateSuccessful);

            if (orderStatus === "PAID") {
              toast({
                title: "Order Confirmed",
                description: `Order #${decryptedOrderNumber} has been successfully placed.`,
              });

              // Use user?.clientId consistently - this is the authoritative source for orders
              // Don't rely on decryptedClientId which might be inconsistent
              const clientId = user?.clientId;
              
              console.log("🔑 Using clientId for coupon fetch:", clientId);

              // Only fetch coupons if order status was actually updated successfully
              // This prevents voucher generation when order status update fails
              if (isUpdateSuccessful && clientId && !couponsFetched && decryptedOrderNumber) {
                fetchCouponsMutation.mutate(
                  {
                    clientId: clientId,
                    orderNumber: decryptedOrderNumber,
                  },
                  {
                    onSuccess: () => {
                      setCouponsFetched(true);
                      toast({
                        title: "🎉 Payment Successful!",
                        description: "Your vouchers are ready. Taking you there now...",
                        duration: 2500,
                      });
                      setTimeout(() => {
                        sessionStorage.setItem('justReturnedFromPayment', 'true');
                        setLocation("/orders");
                      }, 1200);
                    },
                    onError: () => {
                      toast({
                        title: "Payment Successful!",
                        description: "Vouchers will be available shortly in My Vouchers.",
                        duration: 3000,
                      });
                      setTimeout(() => {
                        sessionStorage.setItem('justReturnedFromPayment', 'true');
                        setLocation("/orders");
                      }, 1500);
                    },
                  }
                );
              } else if (!isUpdateSuccessful) {
                console.warn("⚠️ Order status update returned failure, skipping coupon generation");
                toast({
                  title: "Order Processing",
                  description: "Order is being processed. Vouchers will be available shortly.",
                  variant: "default",
                });
              }
            }
          },
          onError: (error: any) => {
            // Don't show session expired dialog for payment result page
            // Just show the payment result without updating status
            console.warn("Order status update failed:", error);
            setStatusUpdated(true); // Mark as updated to prevent retry
            setOrderStatusUpdateSuccess(false); // Mark as failed
            
            if (paymentData.status === "success") {
              toast({
                title: "Payment Successful",
                description: "Order is being processed. Check your orders for status.",
                variant: "default",
              });
            }
          },
        }
      );
    } else if (!loading && !paymentData.encryptedTransactionId) {
      toast({
        title: "Error",
        description: "Transaction information missing. Please contact support.",
        variant: "destructive",
      });
    }
  }, [
    loading,
    statusUpdated,
    paymentData.encryptedTransactionId,
    paymentData.status,
    decryptedOrderNumber,
    decryptedClientId,
    couponsFetched,
    isDecrypted,
    user?.clientId,
    orderStatusUpdateSuccess,
  ]);

  // Status UI helpers
  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-20 w-20 text-primary animate-spin" />;
    }
    switch (paymentData.status) {
      case "success":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-pulse" />
            <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-500 relative z-10" />
          </div>
        );
      case "pending":
        return <Clock className="h-20 w-20 text-yellow-600 dark:text-yellow-500" />;
      case "error":
      default:
        return <XCircle className="h-20 w-20 text-red-600 dark:text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    if (loading) return "Processing...";
    switch (paymentData.status) {
      case "success":
        return "Payment Successful";
      case "pending":
        return "Payment Pending";
      case "error":
      default:
        return "Payment Failed";
    }
  };

  const getStatusColor = () => {
    switch (paymentData.status) {
      case "success":
        return "text-green-700 dark:text-green-400";
      case "pending":
        return "text-yellow-700 dark:text-yellow-400";
      case "error":
      default:
        return "text-red-700 dark:text-red-400";
    }
  };

  const orderDetails = useMemo(() => {
    if (!ordersData?.orders || !decryptedOrderNumber) {
      return null;
    }
    return ordersData.orders.find((o) => o.order_number === decryptedOrderNumber) || null;
  }, [ordersData, decryptedOrderNumber]);

  const voucherItems = useMemo<CouponItem[]>(() => {
    if (!orderDetails?.items?.length) {
      return [];
    }
    return orderDetails.items.flatMap((item) =>
      item.coupons?.flatMap((coupon) =>
        coupon.vd_raw_response?.brand_details?.flatMap((brand) => brand.items || []) || []
      ) || []
    );
  }, [orderDetails]);

  const parsedPaymentAmount = useMemo(() => {
    if (typeof orderDetails?.total_amount === "number") {
      return orderDetails.total_amount;
    }
    if (!voucherItems.length) {
      return null;
    }
    const total = voucherItems.reduce((sum, v) => {
      const numeric = Number(String(v.balanceTotal || "0").replace(/[^0-9.]/g, ""));
      return sum + (Number.isFinite(numeric) ? numeric : 0);
    }, 0);
    return total > 0 ? total : null;
  }, [orderDetails, voucherItems]);

  const statusLabel =
    paymentData.status === "success"
      ? "SUCCESS"
      : paymentData.status === "pending"
      ? "PENDING"
      : "FAILED";

  const maskCard = (value: string) => {
    if (!value) return "N/A";
    const trimmed = value.replace(/\s+/g, "");
    if (trimmed.length <= 4) return trimmed;
    return `${"*".repeat(Math.max(trimmed.length - 4, 0))}${trimmed.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/30 to-muted/10">
      <Header />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12 sm:py-16 flex items-center justify-center">
        <Card className="w-full shadow-xl border-2">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <CardTitle className={`text-2xl sm:text-3xl font-bold mb-2 ${getStatusColor()}`}>
              {getStatusTitle()}
            </CardTitle>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              {paymentData.message}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Order Number Display */}
            {decryptedOrderNumber && (
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-5 rounded-xl border border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">
                  Order Number
                </p>
                <p className="text-xl sm:text-2xl font-mono font-bold tracking-wide text-foreground">
                  #{decryptedOrderNumber}
                </p>
              </div>
            )}

            {!loading && (
              <div className="p-5 rounded-xl border bg-muted/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold">{statusLabel}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-muted-foreground mb-1">Amount</p>
                    <p className="font-semibold">
                      {parsedPaymentAmount != null ? `₹${parsedPaymentAmount.toFixed(2)}` : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Voucher Details</p>
                  {voucherItems.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-auto pr-1">
                      {voucherItems.map((voucher, idx) => (
                        <div key={`${voucher.getCardNo}-${idx}`} className="p-3 rounded-lg border bg-background text-sm">
                          <p><span className="text-muted-foreground">Card:</span> {maskCard(voucher.getCardNo)}</p>
                          <p><span className="text-muted-foreground">PIN:</span> {voucher.getCardPin || "N/A"}</p>
                          <p><span className="text-muted-foreground">Amount:</span> {voucher.balanceTotal ? `₹${voucher.balanceTotal}` : "N/A"}</p>
                          <p><span className="text-muted-foreground">Expiry:</span> {voucher.getExpiryDate || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Vouchers are being processed. Please refresh after a few moments.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Processing Status Indicators */}
            {!loading && paymentData.encryptedTransactionId && (
              <div className="space-y-3 pt-2">
                {/* Order Status Update */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Confirming order...
                      </span>
                    </>
                  ) : statusUpdated && paymentData.status === "success" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Order confirmed
                      </span>
                    </>
                  ) : updateStatusMutation.isError ? (
                    <>
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-400">
                        Status update pending
                      </span>
                    </>
                  ) : null}
                </div>

                {/* Voucher Generation Status */}
                {statusUpdated && paymentData.status === "success" && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    {fetchCouponsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Generating vouchers...
                        </span>
                      </>
                    ) : couponsFetched ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Vouchers sent to your email
                        </span>
                      </>
                    ) : fetchCouponsMutation.isError ? (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-400">
                          Vouchers being processed
                        </span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Error Warning */}
            {!loading && !paymentData.encryptedTransactionId && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  ⚠️ Transaction details unavailable. Please contact support with your payment reference.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {paymentData.status === "success" ? (
                <>
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      // Set flag to force refetch in orders page
                      sessionStorage.setItem('justReturnedFromPayment', 'true');
                      setLocation("/orders");
                    }}
                  >
                    View Orders
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={() => setLocation("/")}
                  >
                    Continue Shopping
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => setLocation("/cart")}
                  >
                    Return to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={() => setLocation("/")}
                  >
                    Go to Home
                  </Button>
                </>
              )}
            </div>

            {/* Support Section */}
            {paymentData.status === "error" && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Need assistance with your payment?
                </p>
                <a
                  href="mailto:support@sabbpe.com"
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  Contact Support →
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
