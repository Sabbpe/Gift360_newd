import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Sun, Moon, MapPin, Package, ChevronDown, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/SimpleTheme";
import { useBrandNames } from "@/hooks/useBrandNames";
import { AuthButton } from "./AuthButton";
import { useConfig } from "@/contexts/ConfigContext";
import CategoryNav from "./CategoryNav";
import { useFetchWallet } from "@/hooks/useFetchWallet";
import { WalletOdometer } from "@/components/WalletOdometer";
import OnlineIndicator from "@/components/OnlineIndicator";

const logoImg = "/Main.Logo.png";

interface LocationData { city: string; state: string; pincode: string; area?: string; district?: string; }
interface PostOffice { Name: string; District: string; State: string; Pincode: string; }

function getSavedLocation(): LocationData | null { const d = localStorage.getItem("user_location"); return d ? JSON.parse(d) : null; }
function saveLocation(loc: LocationData) { localStorage.setItem("user_location", JSON.stringify(loc)); }
async function fetchIPLocation(): Promise<LocationData> { const r = await fetch("https://ipapi.co/json/"); const d = await r.json(); return { city: d.city||"Unknown", state: d.region||"", pincode: d.postal||"", area: d.city||"" }; }
async function fetchLocationsByPincode(pincode: string): Promise<PostOffice[]> { const r = await fetch(`https://api.postalpincode.in/pincode/${pincode}`); const d = await r.json(); return d[0]?.PostOffice || []; }

export default function Header() {
  const { config } = useConfig();
  const { user, isAuthenticated } = useAuthContext();
  const { totalItems } = useCart(user?.clientId);
  const { data: walletData } = useFetchWallet(user?.clientId);
  const walletPoints = walletData?.totalBalance ?? 0;
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const [userLocation, setUserLocation] = useState<LocationData | null>(() => getSavedLocation());
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [list, setList] = useState<PostOffice[]>([]);
  const [selected, setSelected] = useState<PostOffice | null>(null);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { data: brands = [] } = useBrandNames();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/brands", label: "Brands" },
  ];

  const handleHeaderSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && headerSearchQuery.trim()) {
      setLocation(`/brands?search=${encodeURIComponent(headerSearchQuery.trim())}`);
      setHeaderSearchQuery("");
    }
  };

  useEffect(() => {
    if (userLocation) return;
    fetchIPLocation().then(loc => { saveLocation(loc); setUserLocation(loc); }).catch(() => {});
  }, [userLocation]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filteredBrands = useMemo(() => {
    let r = brands as any[];
    if (headerSearchQuery.trim()) {
      const q = headerSearchQuery.toLowerCase();
      r = r.filter((b: any) => (b.BrandName||b.brandName||"").toLowerCase().includes(q));
    }
    return r.sort((a: any, b: any) => {
      const na = (a.BrandName||a.brandName||"").trim();
      const nb = (b.BrandName||b.brandName||"").trim();
      if (/^\d/.test(na) && !/^\d/.test(nb)) return 1;
      if (!/^\d/.test(na) && /^\d/.test(nb)) return -1;
      return na.localeCompare(nb, undefined, { sensitivity:"base" });
    });
  }, [brands, headerSearchQuery]);

  if (!config?.header?.enabled) return null;
  const headerConfig = config.header;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="w-full pl-0 pr-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-16 sm:h-[68px] gap-2">
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0 -ml-1 sm:ml-0">
              {headerConfig.logo.enabled && (
                <Link href="/">
                  <button className="flex items-center p-0 m-0 bg-transparent border-0 outline-none">
                    <img src={logoImg} alt="Gift360" className="h-14 sm:h-16 w-auto object-contain" />
                  </button>
                </Link>
              )}
              <div className="scale-[0.65] origin-left">
                <OnlineIndicator compact />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const active = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button variant="ghost" className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                      active ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}>
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="relative" onMouseEnter={() => setPartnerDropdownOpen(true)} onMouseLeave={() => setPartnerDropdownOpen(false)}>
                <Button variant="ghost" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl flex items-center gap-1">
                  Partner With Us <ChevronDown size={14} />
                </Button>
                {partnerDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-2xl shadow-g-card overflow-hidden z-50">
                    {[["Distributor","/distributor"],["Reseller","/reseller"],["Corporate","/corporate"]].map(([label,href]) => (
                      <Link key={href} href={href}>
                        <button className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/8 hover:text-primary transition-colors">{label}</button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Location */}
              {headerConfig.locationButton?.enabled && (
                <Button variant="outline" className="hidden sm:flex rounded-xl px-3 py-1.5 items-center gap-1.5 text-xs font-semibold border-border/60"
                  onClick={() => setOpenLocationModal(true)}>
                  <MapPin size={13} className="text-primary" />
                  <span className="max-w-[70px] truncate">{userLocation ? userLocation.city : "Location"}</span>
                </Button>
              )}

              {/* Orders */}
              {isAuthenticated && (
                <Link href="/orders" className="hidden md:inline-flex">
                  <Button variant="outline" className="items-center gap-2 rounded-xl px-3 py-1.5 border-border/60 text-sm font-semibold">
                    <Package size={15} /> Orders
                  </Button>
                </Link>
              )}

              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
                  <Bell size={18} />
                  {isAuthenticated && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
                  )}
                </Button>
              </Link>

              {/* Auth — desktop */}
              <div className="relative hidden md:block">
                {isAuthenticated && walletPoints > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                    <WalletOdometer value={walletPoints} />
                  </div>
                )}
                {headerConfig.authButton?.enabled && <AuthButton />}
              </div>

              {/* Theme */}
              {headerConfig.themeToggle?.enabled && (
                <Button size="icon" variant="ghost" onClick={toggleTheme} className="h-9 w-9 rounded-xl">
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </Button>
              )}

              {/* Cart */}
              {headerConfig.cart?.enabled && (
                <Link href="/cart" className="hidden md:inline-flex">
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
                    <ShoppingCart size={18} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-white rounded-full text-[9px] font-bold flex items-center justify-center px-1">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl">
                    <svg width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M0 1h18M0 7h18M0 13h18"/>
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 px-6 py-8 flex flex-col">
                  <img src={logoImg} alt="Gift360" className="h-10 w-auto object-contain mb-6" />
                  <nav className="flex flex-col gap-1">
                    {navLinks.map(link => (
                      <Link key={link.href} href={link.href}>
                        <button className="px-4 py-3 text-left text-sm font-semibold rounded-xl hover:bg-primary/8 hover:text-primary w-full transition-colors">{link.label}</button>
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <>
                        <Link href="/orders"><button className="px-4 py-3 text-left text-sm font-semibold rounded-xl hover:bg-primary/8 w-full flex items-center gap-2"><Package size={16}/>Orders</button></Link>
                        <Link href="/notifications"><button className="px-4 py-3 text-left text-sm font-semibold rounded-xl hover:bg-primary/8 w-full flex items-center gap-2"><Bell size={16}/>Notifications</button></Link>
                        <Link href="/profile"><button className="px-4 py-3 text-left text-sm font-semibold rounded-xl hover:bg-primary/8 w-full flex items-center gap-2"><User size={16}/>Profile</button></Link>
                      </>
                    )}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Partner With Us</p>
                      {[["Distributor","/distributor"],["Reseller","/reseller"],["Corporate","/corporate"]].map(([l,h]) => (
                        <Link key={h} href={h}><button className="px-4 py-3 text-left text-sm font-semibold rounded-xl hover:bg-primary/8 hover:text-primary w-full transition-colors">{l}</button></Link>
                      ))}
                    </div>
                  </nav>
                  {!isAuthenticated && (
                    <div className="mt-auto pt-4">
                      <Link href="/login"><Button className="w-full rounded-xl font-semibold">Sign In</Button></Link>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Category nav — desktop only */}
          <div className="hidden md:block">
            <CategoryNav />
          </div>
        </div>
      </header>

      {/* Location modal */}
      {openLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-card p-6 rounded-2xl shadow-g-card-lg w-full max-w-md border border-border">
            <h2 className="text-base font-bold mb-4">Update Location</h2>
            <div className="flex gap-2">
              <Input placeholder="Enter Pincode" value={pincode} onChange={e => setPincode(e.target.value)} className="h-10 rounded-xl" />
              <Button onClick={async () => setList(await fetchLocationsByPincode(pincode))} className="h-10 rounded-xl">Search</Button>
            </div>
            {list.length > 0 && (
              <select className="w-full border border-border rounded-xl mt-4 p-2 text-sm bg-background font-sans"
                onChange={e => { const v = e.target.value; if (v !== "default") setSelected(JSON.parse(v)); }}>
                <option value="default">Select Area</option>
                {list.map(loc => (
                  <option key={loc.Name} value={JSON.stringify(loc)}>{loc.Name}, {loc.District}, {loc.State}</option>
                ))}
              </select>
            )}
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" className="h-9 px-4 text-sm rounded-xl"
                onClick={() => { setOpenLocationModal(false); setList([]); setSelected(null); setPincode(""); }}>
                Cancel
              </Button>
              <Button disabled={!selected} className="h-9 px-4 text-sm rounded-xl"
                onClick={() => {
                  if (selected) {
                    const loc: LocationData = { city:selected.Name, district:selected.District, state:selected.State, pincode:selected.Pincode };
                    saveLocation(loc); setUserLocation(loc);
                    setOpenLocationModal(false); setList([]); setSelected(null); setPincode("");
                  }
                }}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
