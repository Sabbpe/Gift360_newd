import { useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";
import { ScratchCard } from "@/components/ScratchCard";
import type { Order } from "@/types/order";

interface PaidAmountBreakdown {
  paidAmount: number;
  walletDeduction: number;
  couponDiscount: number;
  subtotal: number;
  processingFee: number;
}

interface OrderDetailsProps {
  order: Order;
  paidBreakdown: PaidAmountBreakdown | null;
}

interface VoucherView {
  key: string;
  brandName: string;
  cardNumber: string;
  cardPin: string;
  expiryDate: string;
  amount: string;
}

export default function OrderDetails({ order, paidBreakdown }: OrderDetailsProps) {
  const vouchers = useMemo<VoucherView[]>(() => {
    return order.items.flatMap((item, itemIndex) => {
      const brandName =
        item.meta && "brand_name" in item.meta
          ? item.meta.brand_name
          : `Brand ${item.brand_id.slice(0, 8)}`;

      const couponItems = item.coupons?.[0]?.vd_raw_response?.brand_details?.[0]?.items ?? [];

      return couponItems.map((coupon, couponIndex) => ({
        key: `${item.order_item_id}-${itemIndex}-${couponIndex}`,
        brandName,
        cardNumber: coupon.getCardNo,
        cardPin: coupon.getCardPin,
        expiryDate: coupon.getExpiryDate,
        amount: coupon.balanceTotal,
      }));
    });
  }, [order.items]);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const voucherCount = vouchers.length;
  const pricing = (order as any)?.pricing ?? {};
  const couponUsed = Boolean((order as any)?.coupon?.used);
  const subtotal = Number(pricing?.subtotal ?? paidBreakdown?.subtotal ?? order.total_amount ?? 0);
  const couponDiscount = couponUsed
    ? Number(pricing?.coupon_discount ?? paidBreakdown?.couponDiscount ?? 0)
    : 0;
  const walletDeduction = Number((order as any)?.wallet_amount ?? paidBreakdown?.walletDeduction ?? 0);
  const processingFee = Number(pricing?.processing_fee ?? paidBreakdown?.processingFee ?? 0);
  const total = Number(pricing?.final_payable ?? paidBreakdown?.paidAmount ?? order.total_amount ?? 0);

  return (
    <div className="border-t bg-background/70 p-4 sm:p-6 space-y-6">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Gift Vouchers</h4>
          <span className="text-xs text-muted-foreground">({voucherCount})</span>
        </div>

        {vouchers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {vouchers.map((voucher, index) => (
                <ScratchCard
                  key={voucher.key}
                  cardNumber={voucher.cardNumber}
                  cardPin={voucher.cardPin}
                  expiryDate={voucher.expiryDate}
                  amount={voucher.amount}
                  index={index}
                />
              ))}
            </div>

            <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Tip:</strong> Scratch the cards above to reveal your voucher codes. Screenshot or note them down for later use!
              </p>
            </div>
          </>
        ) : (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-300">
            ⏳ Vouchers are being generated. Please check back in a few moments.
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h5 className="font-semibold">Order Summary</h5>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coupon Discount</span>
                <span className="text-green-600 dark:text-green-400">-₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}
            {walletDeduction > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wallet Deduction</span>
                <span className="text-green-600 dark:text-green-400">-₹{walletDeduction.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span>₹{processingFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h5 className="font-semibold">Order Information</h5>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span>{format(new Date(order.created_at), "MMM dd, yyyy · hh:mm a")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date</span>
              <span>
                {order.paid_at ? format(new Date(order.paid_at), "MMM dd, yyyy · hh:mm a") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gift Voucher Count</span>
              <span>{voucherCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
