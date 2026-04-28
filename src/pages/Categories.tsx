import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import BrandCard from "@/components/BrandCard";
import { useBrands } from "@/hooks/useBrands";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORY_ICONS: Record<string, string> = {
  "E-Commerce": "🛒", "Fashion": "👗", "Food & Beverages": "🍔", "Travel": "✈️",
  "Entertainment": "🎬", "Health & Wellness": "💊", "Electronics": "💻",
  "Jewellery": "💍", "Beauty": "💄", "Sports": "⚽", "Education": "📚",
  "Gifting": "🎁", "Gaming": "🎮", "Auto": "🚗", "Home": "🏠",
};

export default function Categories() {
  const { data: brands = [], isLoading } = useBrands();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(brands.map((b: any) => b.Category).filter(Boolean))).sort();
    return ["All", ...cats];
  }, [brands]);

  const filtered = useMemo(() => {
    let r = brands as any[];
    if (selectedCat !== "All") r = r.filter(b => b.Category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(b => (b.BrandName || "").toLowerCase().includes(q));
    }
    return r;
  }, [brands, selectedCat, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Purple header */}
        <div className="g-header-gradient py-6 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/75 text-sm font-medium mb-1">Explore</p>
            <h1 className="text-2xl font-extrabold text-white mb-4">Browse by Category</h1>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search brands..." className="pl-10 h-11 bg-white rounded-2xl border-0 shadow-g-card font-medium" />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-lg border-b border-border/50 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-10">
              {categories.map(cat => {
                const icon = CATEGORY_ICONS[cat] || "🏷️";
                const active = selectedCat === cat;
                return (
                  <button key={cat} onClick={() => setSelectedCat(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shrink-0 border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-g-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                    }`}>
                    {cat !== "All" && <span className="text-sm">{icon}</span>}
                    {cat}
                    {active && filtered.length > 0 && (
                      <span className="bg-white/25 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {filtered.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({length:18}).map((_,i) => (
                <div key={i} className="aspect-[3/4] g-skeleton rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-extrabold mb-2">No brands found</h2>
              <p className="text-muted-foreground font-medium text-sm">Try a different search or category</p>
              <button onClick={() => { setSearch(""); setSelectedCat("All"); }}
                className="mt-4 text-sm font-bold text-primary hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-muted-foreground">
                  {filtered.length} brand{filtered.length !== 1 ? "s" : ""}{selectedCat !== "All" ? ` in ${selectedCat}` : ""}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <SlidersHorizontal size={12} />Sorted A–Z
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filtered.map((brand: any, i: number) => (
                  <div key={brand.BrandId || i} className="g-fade-up" style={{ animationDelay: `${Math.min(i, 20) * 0.04}s` }}>
                    <BrandCard brand={brand} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
