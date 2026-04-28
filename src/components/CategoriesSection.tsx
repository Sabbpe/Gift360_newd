import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useBrands } from "@/hooks/useBrands";
import BrandCard from "@/components/BrandCard";
import QuickBuyModal from "@/components/QuickBuyModal";
import type { Brand } from "@/types/brand";

const CATEGORIES = ["Ecommerce","Fashion Lifestyle","Gaming","Food & Beverages","Jewellery","Entertainment","Health & Wellness","Travel"];

export default function CategoriesSection() {
  const { data: brands = [], isLoading } = useBrands();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [quickBuyBrand, setQuickBuyBrand] = useState<Brand | null>(null);
  const [, setLocation] = useLocation();

  const filteredBrands = useMemo(() => {
    const r = brands as Brand[];
    if (!activeCategory) return r;
    return r.filter(b => (b.Category || "").toLowerCase().includes(activeCategory.toLowerCase()));
  }, [brands, activeCategory]);

  return (
    <section className="bg-background pb-24">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pt-5 pb-3">
        <button onClick={() => setActiveCategory(null)}
          className="shrink-0 px-4 py-1.5 rounded-full font-bold text-xs border transition-all"
          style={{ background: !activeCategory ? "hsl(252,80%,58%)" : "hsl(var(--card))", color: !activeCategory ? "hsl(var(--card))" : "#6B7280", borderColor: !activeCategory ? "hsl(252,80%,58%)" : "#E5E7EB" }}>
          All
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className="shrink-0 px-4 py-1.5 rounded-full font-bold text-xs border transition-all"
            style={{ background: activeCategory === cat ? "hsl(252,80%,58%)" : "hsl(var(--card))", color: activeCategory === cat ? "hsl(var(--card))" : "#6B7280", borderColor: activeCategory === cat ? "hsl(252,80%,58%)" : "#E5E7EB" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Brand grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square g-skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredBrands.map((brand: Brand, i: number) => (
              <div key={brand.BrandId || i} className="anim-fade-up" style={{ animationDelay: `${Math.min(i, 18) * 0.04}s` }}>
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>
        )}
      </div>

      {quickBuyBrand && (
        <QuickBuyModal brand={quickBuyBrand} isOpen={!!quickBuyBrand}
          onClose={() => setQuickBuyBrand(null)} brandImage="" />
      )}
    </section>
  );
}
