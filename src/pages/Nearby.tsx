import { useState } from "react";
import { ArrowLeft, Search, Star, Navigation } from "lucide-react";
import { useNearbyStores } from "@/hooks/useNearbyStores";
import MobileBottomNav from "@/components/MobileBottomNav";

const CHIPS = [
  { label: "All", color: "bg-primary text-primary-foreground" },
  { label: "Entertainment", color: "bg-indigo-100 text-indigo-700" },
  { label: "Ecommerce", color: "bg-rose-100 text-rose-700" },
  { label: "Fashion", color: "bg-sky-100 text-sky-700" },
  { label: "Food & Bev", color: "bg-amber-100 text-amber-700" },
  { label: "Jewellery", color: "bg-violet-100 text-violet-700" },
];

export default function Nearby() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const { data: storesData, isLoading } = useNearbyStores({});
  const stores: any[] = storesData?.stores || storesData || [];

  const filtered = stores.filter((s: any) => {
    const name = (s.name || s.BrandName || "").toLowerCase();
    const cat = s.category || s.Category || "";
    return (!search.trim() || name.includes(search.toLowerCase())) &&
           (selectedCat === "All" || cat === selectedCat);
  });

  return (
    <div className="relative min-h-screen bg-background overflow-y-auto no-scrollbar pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 anim-fade-up">
        <button onClick={() => window.history.back()} className="active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-bold">Near by Stores</h1>
      </div>

      {/* Search */}
      <div className="mx-6 anim-fade-up delay-100">
        <div className="relative h-12 rounded-full overflow-hidden p-[1.5px]"
          style={{ background: "linear-gradient(90deg, hsl(330,80%,65%), hsl(220,80%,65%))" }}>
          <div className="w-full h-full rounded-full bg-card flex items-center px-4 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search nearby gift stores"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 mt-4 anim-fade-up delay-200">
        {CHIPS.map(c => (
          <button key={c.label} onClick={() => setSelectedCat(c.label)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCat === c.label ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="px-6 mt-5 anim-fade-up delay-300">
        <h2 className="text-base font-bold mb-2">Near by Stores Map</h2>
        <div className="relative h-36 rounded-2xl overflow-hidden bg-stone-100">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <rect width="200" height="100" fill="#f5f1ea" />
            <path d="M0 60 L80 50 L120 70 L200 55" stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <path d="M40 0 L60 100" stroke="#e5e7eb" strokeWidth="4" fill="none" />
            <path d="M140 0 L160 100" stroke="#e5e7eb" strokeWidth="4" fill="none" />
          </svg>
          {[{ x: "20%", y: "30%" }, { x: "30%", y: "55%" }, { x: "70%", y: "65%" }].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: p.x, top: p.y }}>
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] shadow-tile anim-bob"
                style={{ animationDelay: `${i * 0.3}s` }}>★</div>
            </div>
          ))}
        </div>
      </div>

      {/* Store list */}
      <div className="px-6 mt-5 anim-fade-up delay-400">
        <h2 className="text-base font-bold mb-3">
          {isLoading ? "Loading stores..." : filtered.length > 0 ? `${filtered.length} Stores near you` : "Trending Stores near you"}
        </h2>
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 g-skeleton rounded-2xl" />)
          ) : filtered.length > 0 ? (
            filtered.map((s: any, i: number) => (
              <div key={i} className="bg-card rounded-2xl shadow-tile p-3 flex items-center gap-3 anim-fade-up"
                style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                <div className="w-14 h-14 rounded-xl bg-muted shrink-0 flex items-center justify-center">
                  {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover rounded-xl" />
                    : <span className="text-2xl">🏪</span>}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{s.name || s.BrandName}</p>
                  {s.rating && <p className="text-xs text-muted-foreground">⭐ {s.rating}</p>}
                  {s.address && <p className="text-xs text-muted-foreground truncate">{s.address}</p>}
                  <button className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary">
                    <Navigation size={10} /> Get Directions
                  </button>
                </div>
              </div>
            ))
          ) : (
            [{ name: "Joyalukkas", rating: 4.6 }, { name: "Kalyan Jewellers", rating: 4.6 }, { name: "PMJ Jewellers", rating: 4.6 }].map((s, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-tile p-3 flex items-center gap-3 anim-fade-up"
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
                <div className="w-14 h-14 rounded-xl bg-stone-200 shrink-0 flex items-center justify-center">
                  <span className="text-2xl">💍</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">⭐ {s.rating} (150)</p>
                  <button className="mt-1 text-xs font-semibold text-primary">Get Directions →</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
