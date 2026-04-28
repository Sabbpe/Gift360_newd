import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home } from "lucide-react";
import { useFilterMeta } from "@/hooks/useFilterMeta";
import { useFilteredBrands } from "@/hooks/useFilteredBrands";

export default function CategoryNav() {
    const [, setLocation] = useLocation();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const { data: filterMeta, isLoading: metaLoading } = useFilterMeta();

    const { data: brands = [], isLoading: brandsLoading } = useFilteredBrands({
        categories: hoveredCategory ? [hoveredCategory] : [],
        brands: [],
        minPrice: null,
        maxPrice: null,
        sortBy: null,
        discountRanges: [],
    });

    if (metaLoading) {
        return (
            <div className="bg-card border-t border-b border-border shadow-sm relative">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-6 animate-pulse">
                        <div className="h-8 w-8 bg-muted rounded" />
                        <div className="h-5 w-24 bg-muted rounded" />
                        <div className="h-5 w-24 bg-muted rounded" />
                        <div className="h-5 w-24 bg-muted rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const categories = (filterMeta?.categories || []).sort((a, b) => {
        const nameA = a.trim();
        const nameB = b.trim();

        const startsWithNumberA = /^\d/.test(nameA);
        const startsWithNumberB = /^\d/.test(nameB);

        // If one starts with number and other doesn't, number goes last
        if (startsWithNumberA && !startsWithNumberB) return 1;
        if (!startsWithNumberA && startsWithNumberB) return -1;

        // Both start with letter or both start with number - sort alphabetically
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });

    const handleCategoryClick = (category: string) => {
        const params = new URLSearchParams();
        params.set("categories", category);
        setLocation(`/brands?${params.toString()}`);
    };

    const handleBrandClick = (brandId: string) => {
        setLocation(`/brands/${brandId}`);
    };


    return (
        <div className="bg-card border-t border-b border-border shadow-sm relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
                    {/* Home Icon */}
                    <Link href="/">
                        <div className="flex-shrink-0 h-full flex items-center px-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-all duration-200 cursor-pointer">
                            <Home className="h-full w-auto" />
                        </div>
                    </Link>


                    {/* Categories */}
                    {categories.map((category, index) => (
                        <div
                            key={category}
                            className="relative"
                            onMouseEnter={() => setHoveredCategory(category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            {/* Category Button */}
                            <button
                                id={`category-btn-${index}`}
                                onClick={() => handleCategoryClick(category)}
                                className="flex items-center gap-1.5 px-3 py-0 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-all duration-200 whitespace-nowrap"
                            >
                                {category}
                            </button>

                            {/* Dropdown on Hover - USING FIXED POSITIONING */}
                            {hoveredCategory === category && (
                                <div
                                    className="fixed bg-card shadow-2xl rounded-lg border border-border min-w-[220px] max-w-[250px] max-h-[500px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                                    style={{
                                        zIndex: 9999,
                                        top: `${document.getElementById(`category-btn-${index}`)?.getBoundingClientRect().bottom}px`,
                                        left: `${document.getElementById(`category-btn-${index}`)?.getBoundingClientRect().left}px`,
                                    }}
                                >
                                    {brandsLoading ? (
                                        <div className="p-6 text-center">
                                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                                            <p className="mt-2 text-sm text-muted-foreground">Loading brands...</p>
                                        </div>
                                    ) : brands.length > 0 ? (
                                        <div className="py-2">
                                            <div className="px-3 py-2 border-b border-border">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    {category} Brands
                                                </p>
                                            </div>
                                            {brands
                                                .sort((a, b) => {
                                                    const nameA = (a.brandName || "").trim();
                                                    const nameB = (b.brandName || "").trim();

                                                    const startsWithNumberA = /^\d/.test(nameA);
                                                    const startsWithNumberB = /^\d/.test(nameB);

                                                    if (startsWithNumberA && !startsWithNumberB) return 1;
                                                    if (!startsWithNumberA && startsWithNumberB) return -1;

                                                    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
                                                })
                                                .map((brand) => (
                                                    <button
                                                        key={brand.brandId}
                                                        onClick={() => handleBrandClick(brand.brandId)}
                                                        className="w-full text-left px-4 py-2 hover:bg-accent transition-colors group/item"
                                                    >
                                                        <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                                                            {brand.brandName}
                                                        </span>
                                                    </button>
                                                ))}

                                        </div>
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-sm text-muted-foreground">No brands available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>

            {/* Custom scrollbar styling */}
            {/* <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}
        </div>
    );
}
