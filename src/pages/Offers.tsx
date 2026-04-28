import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiBrands } from "@/data/brands";
import { Zap, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";

export default function Offers() {
  const [, setLocation] = useLocation();

  // Get brands with highest discounts
  const hotDealBrands = useMemo(() => {
    return apiBrands
      .filter((brand) => brand.Discount && parseFloat(brand.Discount) > 0)
      .sort(
        (a, b) =>
          parseFloat(b.Discount || "0") - parseFloat(a.Discount || "0")
      )
      .slice(0, 12);
  }, []);

  const handleBrandClick = (brandCode: string) => {
    setLocation(`/brands/${brandCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="border-b bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Hot Deals</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md border border-primary/20">
                    <Zap className="h-3 w-3" />
                    Limited Time
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {hotDealBrands.length} exclusive offers
                  </span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Don't miss out! Grab the highest discount vouchers available right now.
            </p>
          </div>
        </div>

        {/* Deals Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {hotDealBrands.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                <Zap className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Hot Deals Available</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for exciting offers!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {hotDealBrands.map((brand, index) => (
                <div
                  key={brand.BrandCode}
                  className="group cursor-pointer"
                  onClick={() => handleBrandClick(brand.BrandCode)}
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 0.03}s both`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-md h-full flex flex-col">
                    
                    {/* Discount Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-bold rounded-md shadow-sm">
                        <Zap className="h-3 w-3 fill-white" />
                        {parseFloat(brand.Discount || "0").toFixed(1)}% OFF
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-muted/30">
                      {brand.Images?.base || brand.Images?.thumbnail ? (
                        <img
                          src={brand.Images.base || brand.Images.thumbnail}
                          alt={brand.BrandName}
                          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col">
                      {/* Category */}
                      {brand.Category && (
                        <span className="inline-flex self-start items-center px-2 py-0.5 mb-2 text-xs font-medium rounded bg-primary/10 text-primary">
                          {brand.Category}
                        </span>
                      )}

                      {/* Brand Name */}
                      <h3 className="text-sm font-bold mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                        {brand.BrandName}
                      </h3>

                      {/* Description */}
                      {brand.Description && (
                        <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2 flex-1">
                          {brand.Description}
                        </p>
                      )}

                      {/* Price Range */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-border/50 mb-2.5">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-0.5">
                            Price Range
                          </p>
                          <p className="text-xs font-semibold">
                            ₹{brand.minPrice} - ₹{brand.maxPrice}
                          </p>
                        </div>
                        {brand.Brandtype && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium">
                            {brand.Brandtype}
                          </span>
                        )}
                      </div>

                      {/* Button */}
                      <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5">
                        Grab This Deal
                        <svg
                          className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}