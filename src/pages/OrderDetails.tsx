// pages/OrderDetailPage.tsx
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScratchCard } from "@/components/ScratchCard"; // ✅ Import ScratchCard
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Gift,
} from "lucide-react";
import { format } from "date-fns";

const FALLBACK_IMAGE = "/brand-placeholder.png";

// Image validation
async function validateImage(url: string): Promise<string> {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
      setTimeout(() => reject(), 3000);
    });
  } catch {
    return FALLBACK_IMAGE;
  }
}

// Image component
function BrandImage({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadImage() {
      if (!src || src === FALLBACK_IMAGE) {
        setIsLoading(false);
        return;
      }

      try {
        const validatedUrl = await validateImage(src);
        if (isMounted) setImgSrc(validatedUrl);
      } catch {
        if (isMounted) setImgSrc(FALLBACK_IMAGE);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
      {isLoading ? (
        <div className="animate-pulse bg-neutral-200 dark:bg-neutral-600 w-full h-full" />
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      )}
    </div>
  );
}

export default function OrderDetails() {
  const [, params] = useRoute("/orders/:orderId");
  const orderId = params?.orderId;
  const { user } = useAuthContext();
  const { data, isLoading } = useOrders(user?.clientId);

  const order = data?.orders.find((o) => o.order_id === orderId);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "PAID":
      case "SUCCESS":
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
      case "FAILED":
      case "CANCELLED":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "PAID":
      case "SUCCESS":
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "FAILED":
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getImageUrl = (meta: any): string => {
    if (!meta || !meta.images) return FALLBACK_IMAGE;

    try {
      const images =
        typeof meta.images === "string" ? JSON.parse(meta.images) : meta.images;
      return (
        images.text ||
        images.raw ||
        images.thumbnail ||
        images.featured ||
        FALLBACK_IMAGE
      );
    } catch {
      return FALLBACK_IMAGE;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <Package className="h-20 w-20 mx-auto text-muted-foreground/50" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Not Found</h1>
              <p className="text-muted-foreground">
                This order doesn't exist or you don't have access
              </p>
            </div>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const isPaid =
    order.status.toUpperCase() === "PAID" ||
    order.status.toUpperCase() === "SUCCESS";

  // ✅ Calculate total coupons
  const totalCoupons = order.items.reduce((total, item) => {
    if (
      item.coupons &&
      item.coupons.length > 0 &&
      item.coupons[0]?.vd_raw_response?.brand_details?.[0]?.items
    ) {
      return (
        total + item.coupons[0].vd_raw_response.brand_details[0].items.length
      );
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-muted-foreground">
                    Order #{order.order_number}
                  </p>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      order.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                  {totalCoupons > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                    >
                      <Gift className="h-3 w-3 mr-1" />
                      {totalCoupons} Voucher{totalCoupons > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {order.status === "PENDING" && (
                <Button size="lg" className="h-fit">
                  Complete Payment
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items with Coupons */}
              {order.items.map((item) => {
                const brandName =
                  item.meta && "brand_name" in item.meta
                    ? item.meta.brand_name
                    : `Brand ${item.brand_id.slice(0, 8)}`;
                const imageUrl = getImageUrl(item.meta);
                const category =
                  item.meta && "category" in item.meta
                    ? item.meta.category
                    : "";

                const hasCoupons = item.coupons && item.coupons.length > 0;
                 const couponItems = hasCoupons && item.coupons?.[0]?.vd_raw_response?.brand_details?.[0]?.items
                  ? item.coupons[0].vd_raw_response.brand_details[0].items
                  : [];

                return (
                  <Card key={item.order_item_id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <div className="flex items-center gap-4">
                        <BrandImage src={imageUrl} alt={brandName} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{brandName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity} × ₹
                            {item.unit_value.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-xl text-primary">
                          ₹{item.line_total.toFixed(2)}
                        </p>
                      </div>
                    </CardHeader>

                    {/* ✅ Coupons Section with Scratch Cards */}
                    {hasCoupons && isPaid && (
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                              <Gift className="h-5 w-5 text-primary" />
                              Your Gift Vouchers ({couponItems.length})
                            </h4>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {couponItems.map((coupon, idx) => (
                              <ScratchCard
                                key={idx}
                                cardNumber={coupon.getCardNo}
                                cardPin={coupon.getCardPin}
                                expiryDate={coupon.getExpiryDate}
                                amount={coupon.balanceTotal}
                                index={idx}
                              />
                            ))}
                          </div>

                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              💡 <strong>Tip:</strong> Scratch the cards above
                              to reveal your voucher codes. Screenshot or note
                              them down for later use!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* No coupons message for paid orders */}
                    {!hasCoupons && isPaid && (
                      <CardContent className="p-6">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            ⏳ Vouchers are being generated. Please check back
                            in a few moments.
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <h2 className="font-bold">Order Summary</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Processing Fee
                      </span>
                      <span>₹0.00</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader>
                  <h2 className="font-bold">Order Information</h2>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Order Date</p>
                      <p className="font-medium">
                        {format(orderDate, "MMM dd, yyyy · hh:mm a")}
                      </p>
                    </div>
                  </div>

                  {order.paid_at && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Payment Date</p>
                        <p className="font-medium">
                          {format(new Date(order.paid_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Total Items</p>
                      <p className="font-medium">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {totalCoupons > 0 && (
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Gift Vouchers</p>
                        <p className="font-medium">
                          {totalCoupons} voucher{totalCoupons > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
