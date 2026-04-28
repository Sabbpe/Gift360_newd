import { useAuthContext } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { useFetchWallet } from "@/hooks/useFetchWallet";
import { LogOut, ArrowLeft, Package, Bell, ChevronRight, User, Shield, FileText, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

export default function Profile() {
  const { user, logout: contextLogout, isAuthenticated } = useAuthContext();
  const logoutMutation = useLogout();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: walletData } = useFetchWallet(user?.clientId);
  const walletBalance = walletData?.totalBalance ?? 0;

  const handleLogout = () => {
    if (!user?.token) { contextLogout(); setLocation("/login"); return; }
    logoutMutation.mutate({ token: user.token }, {
      onSuccess: (msg) => {
        contextLogout();
        localStorage.removeItem("shopping_cart");
        toast({ title: "Logged out", description: msg, duration: 3000 });
        setLocation("/login");
      },
      onError: () => { contextLogout(); localStorage.removeItem("shopping_cart"); setLocation("/login"); }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 pb-20">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Sign in to view profile</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Login to access your orders, wallet balance and more.</p>
        <button onClick={() => setLocation("/login")}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-card-soft">
          Login / Register
        </button>
        <MobileBottomNav />
      </div>
    );
  }

  const initials = user?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "U";
  const fields = [
    { label: "Username", value: user?.name || "—" },
    { label: "Email", value: user?.email || "—" },
    { label: "Mobile", value: user?.mobile || user?.mobileNumber || "—" },
    { label: "Gift360 Balance", value: `₹${walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
  ];

  const menuItems = [
    { Icon: Package, label: "My Orders", href: "/orders" },
    { Icon: Bell, label: "Notifications", href: "/notifications" },
    { Icon: Shield, label: "Privacy Policy", href: "/privacy" },
    { Icon: FileText, label: "Terms & Conditions", href: "/terms" },
    { Icon: HelpCircle, label: "Refund Policy", href: "/refund" },
  ];

  return (
    <div className="relative min-h-screen bg-card overflow-hidden pb-20">
      {/* Back button */}
      <div className="px-6 pt-5 anim-fade-up">
        <button onClick={() => window.history.back()} className="active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-4 anim-fade-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-amber-950 text-3xl font-bold shadow-tile"
          style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
          {initials}
        </div>
        <p className="mt-3 text-lg font-bold">{user?.name || "User"}</p>
        {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
      </div>

      {/* Purple panel with fields */}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[40px] p-6 anim-slide-sheet"
        style={{ background: "linear-gradient(180deg, hsl(252,80%,58%) 0%, hsl(252,70%,50%) 100%)", top: "45%" }}>
        <div className="space-y-3 mb-4">
          {fields.map((f, i) => (
            <div key={f.label} className="anim-fade-up" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
              <label className="text-white/75 text-xs font-medium">{f.label}</label>
              <div className="mt-1 w-full h-11 rounded-xl bg-white/95 px-4 flex items-center text-foreground text-sm font-medium">
                {f.value}
              </div>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="space-y-2 mt-4">
          {menuItems.map(({ Icon, label, href }) => (
            <Link key={href} href={href}>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-white/80" />
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} disabled={logoutMutation.isPending}
          className="mt-5 w-full py-3 rounded-full text-white font-semibold shadow-card-soft flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(330,80%,60%), hsl(280,70%,60%))" }}>
          <LogOut className="w-4 h-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log Out"}
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}
