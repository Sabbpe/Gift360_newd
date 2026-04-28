import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuthContext } from "@/contexts/AuthContext";
import { brandApi, giftcardApiClient } from "@/lib/valuedesignApi";
import { ScratchCard } from "@/components/ScratchCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tag, ShoppingBag, Clock, CheckCircle, XCircle, RefreshCw,
  ChevronDown, ChevronUp, BookOpen, CheckCircle2, Calendar,
  CreditCard, Lock, AlertTriangle, Loader2, RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const FALLBACK = "/brand-placeholder.png";
const REDEEMED_KEY = "g360_redeemed_vouchers";

// ── Map API order ─────────────────────────────────────────────────────────────
const mapOrder = (order: any) => {
  const mappedItems = Array.isArray(order?.items)
    ? order.items.map((item: any) => {
        const groups = Array.isArray(item?.gift_voucher_item_coupon_details)
          ? item.gift_voucher_item_coupon_details : [];
        const coupons = groups.map((g: any) => ({
          coupon_id: g?.coupon_id || "",
          vd_raw_response: {
            brand_details: [{
              product_name: item?.meta?.brand_name || "",
              items: Array.isArray(g?.items) ? g.items : [],
            }],
          },
        }));
        return { ...item, coupons, meta: item?.meta || {} };
      })
    : [];
  return {
    ...order,
    items: mappedItems,
    total_amount: Number(order?.pricing?.final_payable ?? order?.pricing?.subtotal ?? order?.total_amount ?? 0),
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getImageUrl = (meta: any): string => {
  if (!meta?.images) return FALLBACK;
  const i = meta.images;
  return i.thumbnail || i.featured || i.text || i.raw || FALLBACK;
};

interface VoucherView {
  key: string; cardNumber: string; cardPin: string; expiryDate: string; amount: string;
}

const extractVouchers = (order: any): VoucherView[] => {
  const results: VoucherView[] = [];
  for (const item of (order?.items || [])) {
    (item?.coupons || []).forEach((c: any, ci: number) => {
      (c?.vd_raw_response?.brand_details || []).forEach((b: any) => {
        (b?.items || []).forEach((v: any, vi: number) => {
          results.push({
            key: `${item.order_item_id}-${ci}-${vi}`,
            cardNumber: v?.getCardNo || "",
            cardPin: v?.getCardPin || "",
            expiryDate: v?.getExpiryDate || "",
            amount: v?.balanceTotal || "",
          });
        });
      });
    });
  }
  return results;
};

// Balance check — Shubhang to build: GET /api/v1/voucher/balance-check?cardNo={cardNo}
// Returns: { balance: string, status: "ACTIVE"|"USED" }
const checkVoucherBalance = async (cardNo: string) => {
  const res = await giftcardApiClient.get(`/v1/voucher/balance-check?cardNo=${encodeURIComponent(cardNo)}`);
  return res.data as { balance: string; status: string };
};

// ── Redeem Sheet ──────────────────────────────────────────────────────────────
function RedeemSheet({
  vouchers, brandName, redeemSteps, onClose, onConfirmed,
}: {
  vouchers: VoucherView[]; brandName: string; redeemSteps?: string | null;
  onClose: () => void; onConfirmed: () => void;
}) {
  const [step, setStep] = useState<"details" | "steps">("details");
  const [checkState, setCheckState] = useState<"idle" | "checking" | "used" | "active" | "error">("idle");
  const [balances, setBalances] = useState<Record<string, string>>({});

  const handleCheck = async () => {
    if (!vouchers.length) { onConfirmed(); onClose(); return; }
    setCheckState("checking");
    try {
      const results = await Promise.all(
        vouchers.map(v => checkVoucherBalance(v.cardNumber).then(r => ({ cardNo: v.cardNumber, balance: r.balance })))
      );
      const map: Record<string, string> = {};
      results.forEach(r => { map[r.cardNo] = r.balance; });
      setBalances(map);
      const allZero = results.every(r => parseFloat(r.balance) === 0);
      setCheckState(allZero ? "used" : "active");
      if (allZero) setTimeout(() => { onConfirmed(); onClose(); }, 1200);
    } catch {
      setCheckState("error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[88vh] overflow-y-auto shadow-g-card-lg"
        style={{ animation: "g-slide-up 0.4s cubic-bezier(.32,.72,.34,1) both" }}>
        <div className="p-5">
          <div className="w-10 h-1.5 rounded-full bg-border mx-auto mb-4" />

          {/* Tabs */}
          <div className="flex bg-muted rounded-2xl p-1 mb-5">
            {[{ id: "details", label: "Voucher Details" }, ...(redeemSteps ? [{ id: "steps", label: "How to Redeem" }] : [])].map(t => (
              <button key={t.id} onClick={() => setStep(t.id as any)}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${step === t.id ? "bg-card text-primary shadow-g-tile" : "text-muted-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {step === "details" ? (
            <>
              <h3 className="text-base font-extrabold mb-4">{brandName}</h3>

              {/* Voucher codes — plain display */}
              <div className="space-y-3 mb-5">
                {vouchers.map((v, i) => {
                  const bal = balances[v.cardNumber];
                  const isUsed = bal !== undefined && parseFloat(bal) === 0;
                  return (
                    <div key={v.key} className="rounded-2xl border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Voucher {vouchers.length > 1 ? i + 1 : ""}</p>
                        {bal !== undefined ? (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isUsed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {isUsed ? "✓ USED" : `Balance: ₹${bal}`}
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary">₹{v.amount}</span>
                        )}
                      </div>
                      <div className="bg-muted rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1"><CreditCard size={12} className="text-primary" /><p className="text-[10px] font-semibold text-muted-foreground">Card Number</p></div>
                        <p className="font-mono font-black text-lg tracking-widest text-foreground break-all">{v.cardNumber || "—"}</p>
                      </div>
                      {v.cardPin && (
                        <div className="bg-muted rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1"><Lock size={12} className="text-primary" /><p className="text-[10px] font-semibold text-muted-foreground">PIN</p></div>
                          <p className="font-mono font-black text-lg tracking-widest text-foreground">{v.cardPin}</p>
                        </div>
                      )}
                      {v.expiryDate && <p className="text-xs text-muted-foreground">Expires: <span className="font-bold text-foreground">{v.expiryDate}</span></p>}
                    </div>
                  );
                })}
              </div>

              {/* Status messages */}
              {checkState === "used" && (
                <div className="mb-4 p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">Voucher confirmed used! Moving to Redeemed...</p>
                </div>
              )}
              {checkState === "active" && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Voucher not yet used</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">This voucher still has balance. Please use it at the merchant first.</p>
                  </div>
                </div>
              )}
              {checkState === "error" && (
                <div className="mb-4 p-3 rounded-2xl bg-muted border border-border flex items-start gap-3">
                  <AlertTriangle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Balance check unavailable</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Cannot verify automatically. Confirm manually if you've used this voucher at the merchant.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={onClose}>Close</Button>
                {checkState === "error" ? (
                  <Button className="flex-1 h-12 rounded-2xl font-bold"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)" }}
                    onClick={() => { onConfirmed(); onClose(); }}>
                    Mark as Redeemed
                  </Button>
                ) : checkState === "active" ? (
                  <Button className="flex-1 h-12 rounded-2xl font-bold opacity-50 cursor-not-allowed" disabled>
                    Not Used Yet
                  </Button>
                ) : (
                  <Button className="flex-1 h-12 rounded-2xl font-bold flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)" }}
                    onClick={handleCheck}
                    disabled={checkState === "checking" || checkState === "used"}>
                    {checkState === "checking" ? <><Loader2 size={16} className="g-spin" />Checking...</> : "I've Used This Voucher"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-base font-extrabold mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />How to Redeem at {brandName}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-line mb-6">{redeemSteps}</div>
              <Button className="w-full h-12 rounded-2xl font-bold" onClick={() => setStep("details")}>Back to Voucher Details</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Voucher Card (PAID, not redeemed) ─────────────────────────────────────────
function VoucherCard({ order, expanded, onToggle, onRedeemed }: {
  order: any; expanded: boolean; onToggle: () => void; onRedeemed: (order: any, vouchers: VoucherView[]) => void;
}) {
  const [showSheet, setShowSheet] = useState(false);
  const item = order.items?.[0];
  const meta = item?.meta || {};
  const brandName = meta.brand_name || `Order #${(order.order_number || "").slice(-8)}`;
  const imageUrl = getImageUrl(meta);
  const redeemSteps = meta.redeem_steps || meta.RedeemSteps || meta.how_to_redeem || null;
  const vouchers = extractVouchers(order);
  const paidAmount = Number(order?.pricing?.final_payable ?? order?.total_amount ?? 0);

  return (
    <>
      <div className="bg-card rounded-3xl border border-border shadow-g-card overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center p-2 shrink-0 border border-border">
                <img src={imageUrl} alt={brandName} className="w-full h-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-sm truncate">{brandName}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">#{order.order_number?.slice(-10)}</p>
                {order.created_at && (
                  <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                    <Calendar size={10} />{format(new Date(order.created_at), "dd MMM yy, hh:mm a")}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xl font-black text-primary shrink-0">₹{paidAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Scratch cards */}
        {expanded && (
          <div className="px-4 sm:px-5 pb-4 space-y-4 border-t border-border/50 pt-4">
            {vouchers.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  {vouchers.map((v, i) => (
                    <ScratchCard key={v.key} cardNumber={v.cardNumber} cardPin={v.cardPin}
                      expiryDate={v.expiryDate} amount={v.amount} index={i} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-medium text-center">
                  💡 Scratch to reveal. Note your codes before using at the merchant.
                </p>
              </>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 text-xs text-amber-800 font-medium">
                ⏳ Vouchers are being generated. Please refresh in a moment.
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 sm:px-5 py-3 border-t border-border/40 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onToggle}
            className="rounded-2xl font-bold text-xs flex items-center gap-1.5">
            {expanded ? <><ChevronUp size={13} />Hide</> : <><ChevronDown size={13} />View Vouchers</>}
          </Button>
          <Button size="sm" onClick={() => setShowSheet(true)}
            className="rounded-2xl font-bold text-xs flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)" }}>
            <CheckCircle2 size={13} />Redeem
          </Button>
        </div>
      </div>

      {showSheet && (
        <RedeemSheet vouchers={vouchers} brandName={brandName} redeemSteps={redeemSteps}
          onClose={() => setShowSheet(false)}
          onConfirmed={() => { onRedeemed(order, vouchers); setShowSheet(false); }} />
      )}
    </>
  );
}

// ── Pending Card ──────────────────────────────────────────────────────────────
function PendingCard({ order }: { order: any }) {
  const item = order.items?.[0];
  const meta = item?.meta || {};
  const brandName = meta.brand_name || `Order #${(order.order_number || "").slice(-8)}`;
  const imageUrl = getImageUrl(meta);
  const amount = Number(order?.pricing?.final_payable ?? order?.total_amount ?? 0);
  const { toast } = useToast();

  const handleRetry = () => {
    toast({ title: "Retry Payment", description: "Please go to cart to retry payment for this order.", duration: 3000 });
  };

  return (
    <div className="bg-card rounded-3xl border border-border shadow-g-card overflow-hidden">
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center p-2 shrink-0 border border-border">
            <img src={imageUrl} alt={brandName} className="w-full h-full object-contain"
              onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm truncate">{brandName}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">#{order.order_number?.slice(-10)}</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 text-[10px] py-0 flex items-center gap-1">
                <Clock size={9} />PENDING
              </Badge>
            </div>
            {order.created_at && (
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                <Calendar size={10} />{format(new Date(order.created_at), "dd MMM yy, hh:mm a")}
              </p>
            )}
          </div>
        </div>
        <p className="text-xl font-black text-foreground shrink-0">₹{amount.toFixed(2)}</p>
      </div>
      <div className="px-4 sm:px-5 py-3 border-t border-border/40 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">Payment not completed</p>
        <Button size="sm" variant="outline" onClick={handleRetry}
          className="rounded-2xl font-bold text-xs flex items-center gap-1.5 border-primary/40 text-primary hover:bg-primary/8">
          <RotateCcw size={13} />Retry Payment
        </Button>
      </div>
    </div>
  );
}

// ── Redeemed Card ─────────────────────────────────────────────────────────────
function RedeemedCard({ item }: { item: any }) {
  const vouchers: VoucherView[] = item.vouchers || [];
  return (
    <div className="rounded-3xl p-4 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #9333ea 100%)" }}>
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/8 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center p-1.5">
              <img src={item.image || FALLBACK} alt={item.brandName} className="w-full h-full object-contain"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
            </div>
            <div>
              <p className="font-extrabold text-sm">{item.brandName}</p>
              <p className="text-white/75 text-xs font-medium">₹{item.amount?.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-full">REDEEMED</span>
        </div>
        {vouchers.length > 0 ? vouchers.map((v, i) => (
          <div key={i} className="bg-white/15 rounded-2xl px-4 py-3 mb-2 last:mb-0 space-y-1">
            <p className="font-black text-sm tracking-widest break-all">{v.cardNumber || "—"}</p>
            {v.cardPin && <p className="text-white/70 text-xs">PIN: {v.cardPin}</p>}
            {v.expiryDate && <p className="text-white/60 text-[10px]">Exp: {v.expiryDate}</p>}
          </div>
        )) : (
          <div className="bg-white/15 rounded-2xl px-4 py-3"><p className="font-black text-sm">Voucher redeemed</p></div>
        )}
        <p className="text-white/60 text-[10px] font-medium mt-2 text-right">
          Redeemed {item.redeemedAt ? format(new Date(item.redeemedAt), "dd MMM yyyy, hh:mm a") : ""}
        </p>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: any; title: string; subtitle: string; action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "linear-gradient(135deg,hsl(var(--primary)/0.1),hsl(var(--accent)))" }}>
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-extrabold mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm font-medium mb-6">{subtitle}</p>
      {action}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Tab = "vouchers" | "pending" | "redeemed";

export default function Orders() {
  const { user, isAuthenticated } = useAuthContext();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("vouchers");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(REDEEMED_KEY) || "[]"); } catch { return []; }
  });

  const fetchOrders = useCallback(async () => {
    if (!user?.clientId) { setOrders([]); return; }
    setLoading(true); setError(false);
    try {
      const res = await brandApi.post("/v1/neworders", { clientId: user.clientId, timeline: 12 });
      const raw = Array.isArray(res?.data?.orders) ? res.data.orders : [];
      setOrders(raw.map(mapOrder).sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch { setError(true); setOrders([]); }
    finally { setLoading(false); }
  }, [user?.clientId]);

  useEffect(() => { if (isAuthenticated) fetchOrders(); }, [isAuthenticated, fetchOrders]);

  // Check if we just came from payment — auto-expand latest paid order
  useEffect(() => {
    if (!orders.length) return;
    const justPaid = sessionStorage.getItem('justReturnedFromPayment');
    if (justPaid) {
      sessionStorage.removeItem('justReturnedFromPayment');
      setTab("vouchers");
      const latest = orders.find(o => o.status?.toUpperCase() === "PAID");
      if (latest) setExpandedId(latest.order_id || latest.order_number);
    }
  }, [orders]);

  const redeemedIds = new Set(redeemed.map((r: any) => r.id || r.orderNumber));

  const handleRedeemed = (order: any, vouchers: VoucherView[]) => {
    const item = order.items?.[0];
    const meta = item?.meta || {};
    const entry = {
      id: order.order_id || order.order_number,
      orderNumber: order.order_number,
      brandName: meta.brand_name || "Voucher",
      amount: order.total_amount,
      image: getImageUrl(meta),
      vouchers,
      redeemedAt: new Date().toISOString(),
    };
    const updated = [entry, ...redeemed];
    setRedeemed(updated);
    localStorage.setItem(REDEEMED_KEY, JSON.stringify(updated));
    setTab("redeemed");
  };

  // Split orders into buckets
  const paidOrders = orders.filter(o =>
    o.status?.toUpperCase() === "PAID" &&
    !redeemedIds.has(o.order_id) &&
    !redeemedIds.has(o.order_number)
  );
  const pendingOrders = orders.filter(o =>
    ["PENDING", "FAILED", "CANCELLED"].includes(o.status?.toUpperCase())
  );

  const tabs: { id: Tab; label: string; Icon: any; count?: number }[] = [
    { id: "vouchers", label: "Vouchers", Icon: Tag, count: paidOrders.length },
    { id: "pending", label: "Pending", Icon: Clock, count: pendingOrders.length },
    { id: "redeemed", label: "Redeemed", Icon: CheckCircle2, count: redeemed.length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <EmptyState icon={ShoppingBag} title="Please Login" subtitle="Login to view your vouchers"
            action={<Link href="/login"><Button className="rounded-2xl font-bold px-8 h-12">Sign In</Button></Link>} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Purple header */}
        <div className="g-header-gradient py-6 px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/75 text-sm font-medium">Your wallet</p>
                <h1 className="text-2xl font-extrabold text-white">My Vouchers</h1>
              </div>
              <button onClick={fetchOrders}
                className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                <RefreshCw size={16} color="white" className={loading ? "g-spin" : ""} />
              </button>
            </div>
            {/* 3 tabs */}
            <div className="flex bg-white/15 rounded-2xl p-1 gap-0.5">
              {tabs.map(({ id, label, Icon, count }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    tab === id ? "bg-white text-primary shadow-g-tile" : "text-white/80 hover:text-white"
                  }`}>
                  <Icon size={13} />{label}
                  {(count ?? 0) > 0 && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      tab === id ? "bg-primary text-white" : "bg-white/25 text-white"
                    }`}>{count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 g-skeleton rounded-3xl" />)}</div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="h-12 w-12 mx-auto text-red-400 mb-3" />
              <p className="font-bold mb-1">Failed to load</p>
              <p className="text-sm text-muted-foreground mb-4">Could not fetch your orders</p>
              <Button onClick={fetchOrders} className="rounded-2xl font-bold">Retry</Button>
            </div>
          ) : tab === "vouchers" ? (
            paidOrders.length === 0 ? (
              <EmptyState icon={Tag} title="No Vouchers Yet"
                subtitle="Your purchased vouchers will appear here after payment"
                action={<Link href="/brands"><Button className="rounded-2xl h-12 px-8 font-bold shadow-g-primary">Browse Brands</Button></Link>} />
            ) : (
              <div className="space-y-4">
                {paidOrders.map(order => {
                  const id = order.order_id || order.order_number;
                  return (
                    <VoucherCard key={id} order={order}
                      expanded={expandedId === id}
                      onToggle={() => setExpandedId(prev => prev === id ? null : id)}
                      onRedeemed={handleRedeemed} />
                  );
                })}
              </div>
            )
          ) : tab === "pending" ? (
            pendingOrders.length === 0 ? (
              <EmptyState icon={Clock} title="No Pending Orders" subtitle="All your orders have been processed" />
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(order => <PendingCard key={order.order_id || order.order_number} order={order} />)}
              </div>
            )
          ) : (
            redeemed.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No Redeemed Vouchers"
                subtitle="Vouchers you've used at merchants will appear here after balance confirmation" />
            ) : (
              <div className="space-y-4">
                {redeemed.map((item: any) => <RedeemedCard key={item.id} item={item} />)}
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
