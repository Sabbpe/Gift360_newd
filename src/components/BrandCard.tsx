import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Brand } from "@/types/brand";
import QuickBuyModal from "@/components/QuickBuyModal";

const FALLBACK = "/brand-placeholder.png";

interface BrandCardProps { brand: Brand; }

async function validateImage(url: string): Promise<string> {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
      setTimeout(() => reject(), 5000);
    });
  } catch { return FALLBACK; }
}

export default function BrandCard({ brand }: BrandCardProps) {
  const [imgSrc, setImgSrc] = useState(FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickBuy, setShowQuickBuy] = useState(false);

  const rawImage =
    brand.Images?.text || brand.Images?.thumbnail || brand.Images?.featured ||
    brand.Images?.base || brand.Images?.mobile || brand.Images?.small || brand.Images?.raw || null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const sabbpeUrl = `https://images.gift360.io/${brand.BrandId}.png`;
      if (!rawImage) {
        try { const u = await validateImage(sabbpeUrl); if (mounted) setImgSrc(u); }
        catch { if (mounted) setImgSrc(FALLBACK); }
      } else {
        try { const u = await validateImage(rawImage); if (mounted) setImgSrc(u); }
        catch {
          try { const u = await validateImage(sabbpeUrl); if (mounted) setImgSrc(u); }
          catch { if (mounted) setImgSrc(FALLBACK); }
        }
      }
      if (mounted) setIsLoading(false);
    })();
    return () => { mounted = false; };
  }, [rawImage, brand.BrandId]);

  return (
    <>
      <div className="g-brand-card cursor-pointer group h-full flex flex-col">
        <Link href={`/brands/${brand.BrandId}`} className="flex-1 block">
          <div className="p-3 flex flex-col h-full">
            {/* Cashback badge */}
            {brand.Discount && parseFloat(brand.Discount) > 0 && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-g-primary flex items-center gap-1">
                  ⭐ {parseFloat(brand.Discount).toFixed(1)}%
                </div>
              </div>
            )}

            {/* Brand image */}
            <div className="w-full aspect-square rounded-xl bg-muted/40 overflow-hidden flex items-center justify-center p-3 mb-2">
              {isLoading ? (
                <div className="w-full h-full g-skeleton" />
              ) : imgSrc === FALLBACK ? (
                <Store className="h-10 w-10 text-muted-foreground/40" />
              ) : (
                <img src={imgSrc} alt={brand.BrandName}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImgSrc(FALLBACK)} />
              )}
            </div>

            {/* Name */}
            <div className="min-h-[2rem] flex items-center justify-center mb-1">
              <h3 className="font-bold text-xs text-center text-foreground line-clamp-2 leading-tight">
                {brand.BrandName}
              </h3>
            </div>

            {/* Category */}
            {brand.Category && (
              <div className="flex items-center justify-center">
                <span className="text-[9px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium whitespace-nowrap">
                  {brand.Category}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Quick Buy button */}
        <div className="px-3 pb-3">
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setShowQuickBuy(true); }}
            className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold text-[11px]
              flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all
              hover:scale-[1.02] active:scale-[0.98] shadow-g-primary">
            <ShoppingCart size={12} />
            Quick Buy
          </button>
        </div>
      </div>

      <QuickBuyModal brand={brand} isOpen={showQuickBuy} onClose={() => setShowQuickBuy(false)} brandImage={imgSrc} />
    </>
  );
}
