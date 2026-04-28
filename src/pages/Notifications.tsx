import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, Clock, Package, RefreshCw, Bell } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { brandApi } from "@/lib/valuedesignApi";
import { formatDistanceToNow } from "date-fns";
import MobileBottomNav from "@/components/MobileBottomNav";

interface Notification {
  id: string; type: "success" | "pending" | "failed" | "info";
  title: string; body: string; time: string;
}

const typeConfig = {
  success: { Icon: CheckCircle2, accent: "#10b981" },
  pending: { Icon: Clock, accent: "#f59e0b" },
  failed:  { Icon: RefreshCw, accent: "#f43f5e" },
  info:    { Icon: Package, accent: "hsl(var(--primary))" },
};

const ordersToNotifications = (orders: any[]): Notification[] =>
  orders.slice(0, 20).map(order => {
    const itemName = order.items?.[0]?.meta?.brand_name || "Gift Voucher";
    const amount = Number(order?.pricing?.final_payable ?? order?.pricing?.subtotal ?? 0);
    const status = order.status?.toUpperCase();
    let type: Notification["type"] = "info";
    let title = "Order Update";
    let body = `Order #${(order.order_number || "").slice(-8)}`;
    if (status === "PAID" || status === "COMPLETED") {
      type = "success"; title = `${itemName} Purchased 🎉`;
      body = `Your ₹${amount.toLocaleString("en-IN")} ${itemName} voucher was purchased successfully.`;
    } else if (status === "PENDING") {
      type = "pending"; title = "Payment Processing";
      body = `Your ₹${amount.toLocaleString("en-IN")} ${itemName} order is being processed.`;
    } else if (status === "FAILED" || status === "CANCELLED") {
      type = "failed"; title = "Order Failed";
      body = `Your ₹${amount.toLocaleString("en-IN")} ${itemName} order could not be completed.`;
    }
    return { id: order.order_id || order.order_number, type, title, body, time: order.created_at || new Date().toISOString() };
  });

export default function Notifications() {
  const { user, isAuthenticated } = useAuthContext();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.clientId) return;
    setLoading(true);
    try {
      const res = await brandApi.post("/v1/neworders", { clientId: user.clientId });
      const orders = res?.data?.orders || res?.data || [];
      setNotifications(ordersToNotifications(Array.isArray(orders) ? orders : []));
    } catch { setNotifications([]); }
    finally { setLoading(false); }
  }, [user?.clientId]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  return (
    <div className="relative min-h-screen pb-20"
      style={{ background: "linear-gradient(180deg, hsl(252,70%,92%) 0%, hsl(0,0%,100%) 80%)" }}>

      <div className="px-6 pt-5 anim-fade-up">
        <button onClick={() => window.history.back()} className="active:scale-95 mb-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold mt-2">Notifications</h1>
      </div>

      <div className="px-6 mt-5 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 g-skeleton rounded-2xl" />
          ))
        ) : !isAuthenticated ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.5} />
            <h3 className="font-bold text-lg mb-2">Sign in to see notifications</h3>
            <button onClick={() => setLocation("/login")}
              className="mt-3 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              Login
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.5} />
            <h3 className="font-bold text-lg mb-1">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">Your order updates will appear here.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const cfg = typeConfig[n.type];
            return (
              <div key={n.id} className="relative bg-card rounded-2xl shadow-tile p-4 pl-5 anim-fade-up overflow-hidden"
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full" style={{ background: cfg.accent }} />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                    {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}
