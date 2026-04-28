import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Bell, Eye, EyeOff, Gift, Send, ScanLine, UserPlus, Sparkles, CreditCard, ChevronRight, Crown, Wifi, TrendingUp, Wallet, Plus, Search, LogIn } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFetchWallet } from "@/hooks/useFetchWallet";
import { useBrands } from "@/hooks/useBrands";
import { useBrandNames } from "@/hooks/useBrandNames";
import { CountUp } from "@/components/CountUp";
import { FloatingCoins } from "@/components/FloatingCoins";
import MobileBottomNav from "@/components/MobileBottomNav";
import QuickBuyModal from "@/components/QuickBuyModal";
import type { Brand } from "@/types/brand";

const FALLBACK = "/brand-placeholder.png";
const ONBOARDING_KEY = "g360_onboarding_v3";

function getBrandImg(b: any): string | null {
  return b?.Images?.text || b?.Images?.thumbnail || b?.Images?.featured || b?.Images?.base || null;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthContext();
  const { data: walletData } = useFetchWallet(user?.clientId);
  const { data: brandsRaw = [] } = useBrands();
  const { data: brandNames = [] } = useBrandNames();
  const [showBalance, setShowBalance] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickBuyBrand, setQuickBuyBrand] = useState<Brand | null>(null);

  const walletBalance = walletData?.totalBalance ?? 0;
  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = user?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "U";
  const brands = brandsRaw as Brand[];

  // Check onboarding
  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setLocation("/onboarding");
    }
  }, []);

  const recommended = useMemo(() =>
    [...brands].filter(b => parseFloat(b.Discount || "0") > 0)
      .sort((a, b) => parseFloat(b.Discount || "0") - parseFloat(a.Discount || "0"))
      .slice(0, 6), [brands]);

  const topBrands = useMemo(() => brands.slice(0, 14), [brands]);
  const recentlyUsed = useMemo(() => brands.slice(0, 6), [brands]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return (brandNames as any[]).filter(b => (b.BrandName || "").toLowerCase().includes(q)).slice(0, 8);
  }, [brandNames, search]);

  return (
    <div className="relative bg-background min-h-screen pb-20">
      {/* ── Aurora hero backdrop ── */}
      <div className="absolute top-0 left-0 right-0 h-[420px] bg-hero-aurora rounded-b-[44px] overflow-hidden">
        <FloatingCoins count={10} />
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl anim-aurora"
          style={{ background: "radial-gradient(circle, hsla(280,90%,60%,0.55), transparent 70%)" }} />
        <div className="absolute top-20 -right-12 w-64 h-64 rounded-full blur-3xl anim-aurora"
          style={{ background: "radial-gradient(circle, hsla(220,90%,55%,0.5), transparent 70%)", animationDelay: "3s" }} />
        <div className="absolute top-40 left-1/3 w-40 h-40 rounded-full blur-3xl anim-aurora"
          style={{ background: "radial-gradient(circle, hsla(48,95%,60%,0.28), transparent 70%)", animationDelay: "6s" }} />
        <div className="absolute inset-0 hero-grain opacity-50 pointer-events-none" />
        <svg className="absolute -right-16 -top-10 opacity-[0.08] pointer-events-none" width="280" height="280" viewBox="0 0 280 280" fill="none">
          <circle cx="140" cy="140" r="135" stroke="white" />
          <circle cx="140" cy="140" r="105" stroke="white" />
          <circle cx="140" cy="140" r="75" stroke="white" />
          <circle cx="140" cy="140" r="45" stroke="white" />
        </svg>
      </div>

      <div className="relative">
        {/* ── Header row ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-5 anim-fade-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation(isAuthenticated ? "/profile" : "/login")}
              className="relative w-11 h-11 rounded-full active:scale-95 transition-transform"
              aria-label={isAuthenticated ? "Open profile" : "Open login"}
            >
              <span className="absolute -inset-[2px] rounded-full bg-gold-gradient" />
              <span className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-amber-950 flex items-center justify-center font-bold text-[15px]">
                {initials}
              </span>
            </button>
            <div className="leading-tight">
              <p className="text-white/55 text-[10px] uppercase tracking-[0.18em] font-semibold">
                {isAuthenticated ? "Welcome back" : "India's #1 Gift Platform"}
              </p>
              <h1 className="text-white text-[20px] font-bold tracking-tight">
                {isAuthenticated ? (user?.name || "User") : "Hi there!"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={() => setLocation("/login")}
                className="h-10 px-3 rounded-full bg-gold-gradient text-amber-950 text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
              >
                <LogIn className="w-3.5 h-3.5" strokeWidth={2.4} />
                Login
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => setLocation("/profile")}
                className="h-10 px-3 rounded-full bg-white/8 border border-white/15 backdrop-blur text-white/90 text-[12px] font-semibold active:scale-95 transition-transform"
              >
                Profile
              </button>
            )}
            <button className="w-10 h-10 rounded-full bg-white/8 border border-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition-transform">
              <Sparkles className="w-[18px] h-[18px] text-white/85" strokeWidth={2} />
            </button>
            <button onClick={() => setLocation("/notifications")}
              className="relative w-10 h-10 rounded-full bg-white/8 border border-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition-transform">
              <Bell className="w-[18px] h-[18px] text-white/85" strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-[#1d1638]" />
            </button>
          </div>
        </div>

        {/* ── Premium black metal card ── */}
        <div className="px-6 anim-fade-up delay-100">
          <div className="relative">
            <div className="absolute left-4 right-4 -bottom-2 h-5 rounded-2xl bg-white/8 blur-[1px]" />
            <div className="absolute left-2 right-2 -bottom-1 h-5 rounded-2xl bg-white/12" />

            <div className="relative bg-blackcard rounded-3xl p-5 overflow-hidden card-edge premium-sheen">
              <div className="absolute inset-y-0 -left-10 w-1/2 anim-hologram pointer-events-none"
                style={{ background: "linear-gradient(115deg, transparent 35%, hsla(48,95%,75%,0.18) 50%, hsla(280,90%,70%,0.14) 60%, transparent 75%)", filter: "blur(8px)" }} />
              <div className="absolute -bottom-12 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-60"
                style={{ background: "radial-gradient(circle, hsla(45,95%,60%,0.35), transparent 70%)" }} />
              <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" viewBox="0 0 300 180" preserveAspectRatio="none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ellipse key={i} cx="150" cy="90" rx={140 - i * 6} ry={70 - i * 3} stroke="white" strokeWidth="0.4" fill="none" />
                ))}
              </svg>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/45 text-[9px] uppercase tracking-[0.22em] font-semibold">Gift360</p>
                    <p className="text-gold-gradient text-[15px] font-extrabold tracking-wide leading-tight">ELITE</p>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/8 border border-amber-300/30 backdrop-blur">
                    <Crown className="w-2.5 h-2.5 text-amber-300" strokeWidth={2.5} />
                    <span className="text-amber-200 text-[9px] font-bold tracking-[0.15em] uppercase">Premium</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mt-3">
                  <div className="card-emv-chip w-9 h-7 rounded-md" />
                  <Wifi className="w-4 h-4 text-amber-200/80 -rotate-90" strokeWidth={2.2} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white/55 text-[10px] uppercase tracking-[0.18em] font-semibold">Available Balance</p>
                    <button onClick={() => setShowBalance(s => !s)} className="text-white/55 hover:text-white/80 transition">
                      {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-white text-[32px] leading-none font-bold tracking-tight">
                    <span className="text-white/55 text-[18px] font-semibold mr-1">₹</span>
                    {showBalance
                      ? isAuthenticated ? <CountUp to={walletBalance} duration={1500} /> : "0"
                      : "•••••"}
                    <span className="text-white/55 text-[18px] font-semibold">{showBalance ? ".00" : ""}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <p className="text-white/55 text-[10px] tracking-[0.12em] font-mono whitespace-nowrap">
                    ••••&nbsp;••••&nbsp;••••&nbsp;{user?.clientId?.slice(-4) || "0000"}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="px-2.5 py-1 rounded-full bg-white/8 border border-white/15 text-white/85 text-[10px] font-semibold flex items-center gap-1 hover:bg-white/12 transition whitespace-nowrap"
                      onClick={() => setLocation("/cart")}>
                      <Plus className="w-3 h-3" strokeWidth={2.6} /> Top-up
                    </button>
                    <button className="px-2.5 py-1 rounded-full bg-gold-gradient text-amber-950 text-[10px] font-bold flex items-center gap-1 shadow-soft whitespace-nowrap"
                      onClick={() => setLocation("/brands")}>
                      <Send className="w-3 h-3" strokeWidth={2.6} /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { Icon: TrendingUp, label: "Saved", value: "₹2.4K" },
                { Icon: Wallet, label: "Vouchers", value: String((brandsRaw as any[]).length || 0) },
                { Icon: Sparkles, label: "Cashback", value: "₹312" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white/8 border border-white/12 backdrop-blur px-2.5 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-amber-900" strokeWidth={2.6} />
                  </div>
                  <div className="leading-tight min-w-0">
                    <p className="text-white/55 text-[9px] uppercase tracking-wider font-semibold">{label}</p>
                    <p className="text-white text-[12px] font-bold truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-4 gap-2 px-6 mt-8 anim-fade-up delay-200">
          {[
            { Icon: Gift, label: "Buy Voucher", href: "/brands", tint: "linear-gradient(135deg, hsl(252 90% 96%), hsl(280 80% 94%))", ring: "hsl(252 80% 64% / 0.25)", color: "hsl(252 70% 50%)" },
            { Icon: Send, label: "Near by stores", href: "/nearby", tint: "linear-gradient(135deg, hsl(195 90% 96%), hsl(180 80% 93%))", ring: "hsl(195 80% 55% / 0.25)", color: "hsl(195 70% 40%)" },
            { Icon: ScanLine, label: "Redeem", href: "/orders", tint: "linear-gradient(135deg, hsl(340 90% 97%), hsl(20 90% 95%))", ring: "hsl(340 80% 60% / 0.25)", color: "hsl(340 70% 50%)" },
            { Icon: UserPlus, label: "Partner with Us", href: "/distributor", tint: "linear-gradient(135deg, hsl(45 95% 94%), hsl(35 90% 92%))", ring: "hsl(35 85% 55% / 0.3)", color: "hsl(30 80% 45%)" },
          ].map(({ Icon, label, href, tint, ring, color }) => (
            <button key={label} onClick={() => setLocation(href)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group">
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: tint, boxShadow: `inset 0 0 0 1px ${ring}, 0 4px 12px -4px ${ring}` }}>
                <Icon className="w-[22px] h-[22px]" strokeWidth={2.2} style={{ color }} />
              </div>
              <span className="text-[11px] text-foreground text-center font-medium leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Search bar ── */}
        <div className="px-6 mt-5 relative anim-fade-up delay-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => search && setShowSuggestions(true)}
              onKeyDown={e => { if (e.key === "Enter" && search.trim()) { setLocation(`/brands?search=${encodeURIComponent(search)}`); setShowSuggestions(false); }}}
              placeholder="Search brands, vouchers..."
              className="w-full pl-10 pr-4 h-11 rounded-2xl text-sm font-medium bg-white/95 border border-white/20 outline-none focus:ring-2 ring-primary/30"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }} />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl overflow-y-auto z-50"
                style={{ maxHeight: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                onMouseDown={e => e.preventDefault()}>
                {suggestions.map((b: any, i: number) => (
                  <button key={i} onClick={() => { setLocation(`/brands/${b.BrandId || b.brandId}`); setSearch(""); setShowSuggestions(false); }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{b.BrandName || b.brandName}</span>
                    {b.Category && <span className="text-xs text-muted-foreground">{b.Category}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Instant Gifting banner ── */}
        <div className="mx-6 mt-6 rounded-3xl bg-premium-banner p-5 shadow-card overflow-hidden anim-fade-up delay-300 relative premium-sheen">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-semibold tracking-wider uppercase text-amber-200">
                <Sparkles className="w-2.5 h-2.5" strokeWidth={2.4} /> Instant Gifting
              </span>
              <h3 className="mt-2 text-[19px] font-bold text-white leading-tight">
                Send a gift in <span className="text-gold-gradient">3 simple steps</span>
              </h3>
              <p className="mt-1 text-[11px] text-white/65 leading-snug">Choose a brand · Pay securely · Deliver instantly.</p>
            </div>
            <div className="relative w-[78px] h-[78px] shrink-0">
              <div className="absolute inset-0 rounded-2xl anim-card-tilt shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(280 70% 45%), hsl(258 60% 35%))", boxShadow: "0 8px 20px -6px rgba(0,0,0,0.5)" }} />
              <div className="absolute inset-0 rounded-2xl anim-card-tilt-2 overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(45 90% 65%), hsl(35 95% 50%))", boxShadow: "0 10px 24px -6px rgba(255,180,60,0.5)" }}>
                <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)" }} />
                <div className="absolute top-2 left-2 w-5 h-3.5 rounded-sm bg-white/40" />
                <Gift className="absolute bottom-1.5 right-1.5 w-5 h-5 text-white/90" strokeWidth={2.2} />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-200 anim-twinkle" />
            </div>
          </div>
          <div className="relative mt-4 flex items-center justify-between">
            {[{ Icon: Sparkles, label: "Choose" }, { Icon: CreditCard, label: "Pay" }, { Icon: Send, label: "Send" }].map(({ Icon, label }, i) => (
              <div key={label} className="relative flex flex-col items-center z-10" style={{ flex: "0 0 auto" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gold-gradient anim-step-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
                  <Icon className="w-4 h-4 text-amber-900" strokeWidth={2.6} />
                </div>
                <span className="mt-1.5 text-[10px] font-semibold text-white/85">{label}</span>
              </div>
            ))}
            <svg className="absolute left-9 right-9 top-[18px] h-px pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 1" style={{ width: "calc(100% - 72px)" }}>
              <line x1="0" y1="0.5" x2="200" y2="0.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="4 4" className="anim-dash-flow" />
            </svg>
          </div>
          <button onClick={() => setLocation("/brands")} className="mt-4 w-full px-4 py-2 rounded-full bg-gold-gradient text-amber-950 text-[13px] font-bold shadow-soft active:scale-[0.98] transition-transform flex items-center justify-center gap-1">
            Start Gifting <ChevronRight className="w-4 h-4" />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => setLocation("/login")}
              className="mt-3 w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[13px] font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-1"
            >
              Login / Register <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Recommended ── */}
        <div className="px-6 mt-6 anim-fade-up delay-400">
          <h3 className="text-lg font-bold text-foreground mb-3">Recommended</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
            {recommended.map((brand: Brand) => {
              const img = getBrandImg(brand);
              return (
                <button key={brand.BrandId} onClick={() => setQuickBuyBrand(brand)}
                  className="text-left min-w-[210px] bg-card rounded-2xl shadow-tile p-3 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center p-1.5">
                    {img ? <img src={img} alt={brand.BrandName} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                      : <div className="w-full h-full bg-accent rounded-lg" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{brand.BrandName}</p>
                    <p className="text-[11px] text-muted-foreground">{brand.Category || "E-Gift Card"}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold">₹{brand.MinPrice || brand.minPrice || "50"}</span>
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">Buy</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Top Brands — magical 3D dual marquee ── */}
        <div className="mt-8 anim-fade-up delay-500">
          <div className="px-6 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold title-magic">Top Brands</h3>
              <span className="text-base anim-twinkle" style={{ animationDelay: "0s" }}>✨</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">Trending</span>
          </div>
          <div className="relative brand-stage py-3 overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full blur-3xl pointer-events-none anim-orb" style={{ background: "hsl(252 80% 64% / 0.35)", top: "-20px", left: "10%" }} />
            <div className="absolute w-28 h-28 rounded-full blur-3xl pointer-events-none anim-orb" style={{ background: "hsl(280 90% 70% / 0.3)", top: "30px", right: "15%", animationDelay: "2s" }} />
            <div className="absolute w-24 h-24 rounded-full blur-3xl pointer-events-none anim-orb" style={{ background: "hsl(48 95% 65% / 0.25)", bottom: "0px", left: "45%", animationDelay: "4s" }} />
            {[{ top: "10%", left: "8%", delay: "0s" }, { top: "60%", left: "22%", delay: "0.8s" }, { top: "20%", left: "55%", delay: "1.4s" }, { top: "75%", left: "70%", delay: "0.4s" }, { top: "35%", left: "88%", delay: "2s" }].map((s, i) => (
              <span key={i} className="absolute text-primary anim-twinkle pointer-events-none text-xs" style={{ top: s.top, left: s.left, animationDelay: s.delay }}>✦</span>
            ))}
            {/* RTL row */}
            <div className="marquee-mask brand-track-3d">
              <div className="flex gap-3 anim-marquee-rtl w-max px-2">
                {[...topBrands, ...topBrands].map((b: Brand, i) => {
                  const img = getBrandImg(b);
                  return (
                    <button key={`r1-${i}`} onClick={() => setQuickBuyBrand(b)}
                      className="brand-tile group relative shrink-0" style={{ animationDelay: `${(i % 8) * 0.25}s` }}>
                      <div className="absolute -inset-[2px] rounded-2xl brand-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]" />
                      <div className="relative w-[88px] bg-card rounded-2xl shadow-tile p-2.5 flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center p-1.5">
                          {img ? <img src={img} alt={b.BrandName} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                            : <div className="w-full h-full bg-accent rounded-xl" />}
                        </div>
                        <p className="text-[10px] font-semibold text-foreground text-center truncate w-full">{b.BrandName?.slice(0, 12)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* LTR row */}
            <div className="marquee-mask brand-track-3d mt-3">
              <div className="flex gap-3 anim-marquee-ltr w-max px-2">
                {[...[...topBrands].reverse(), ...[...topBrands].reverse()].map((b: Brand, i) => {
                  const img = getBrandImg(b);
                  return (
                    <button key={`r2-${i}`} onClick={() => setQuickBuyBrand(b)}
                      className="brand-tile group relative shrink-0" style={{ animationDelay: `${(i % 8) * 0.3 + 0.5}s` }}>
                      <div className="absolute -inset-[2px] rounded-2xl brand-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]" />
                      <div className="relative w-[78px] bg-card rounded-2xl p-2 flex flex-col items-center gap-1" style={{ boxShadow: "0 4px 16px -6px rgba(0,0,0,0.12)" }}>
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1">
                          {img ? <img src={img} alt={b.BrandName} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                            : <div className="w-full h-full bg-accent rounded-xl" />}
                        </div>
                        <p className="text-[9px] font-semibold text-foreground text-center truncate w-full">{b.BrandName?.slice(0, 10)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recently Used ── */}
        <div className="px-6 mt-6 pb-4 anim-fade-up delay-500">
          <h3 className="text-lg font-bold text-foreground mb-3">Recently Used</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
            {recentlyUsed.map((b: Brand, i: number) => {
              const img = getBrandImg(b);
              return (
                <button key={i} onClick={() => setQuickBuyBrand(b)}
                  className="w-12 h-12 rounded-full bg-card shadow-tile flex items-center justify-center p-1.5 shrink-0 active:scale-95 transition-transform">
                  {img ? <img src={img} alt={b.BrandName} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                    : <div className="w-full h-full bg-accent rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <MobileBottomNav />

      {quickBuyBrand && (
        <QuickBuyModal brand={quickBuyBrand} isOpen={!!quickBuyBrand}
          onClose={() => setQuickBuyBrand(null)} brandImage={getBrandImg(quickBuyBrand) || FALLBACK} />
      )}
    </div>
  );
}
