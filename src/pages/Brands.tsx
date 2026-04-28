import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/Header";
import BrandCard from "@/components/BrandCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import FilterSidebar from "@/components/FilterSidebar";
import { useQueryLocation } from "@/hooks/useQueryLocation";
import { useBrands } from "@/hooks/useBrands";
import { useFilterMeta } from "@/hooks/useFilterMeta";
import { useFilteredBrands } from "@/hooks/useFilteredBrands";
import { useBrandSearch } from "@/hooks/useBrandSearch";
import BrandsPageSkeleton from "@/components/BrandsPageSkeleton";
import { useLocation } from "wouter";
import MobileBottomNav from "@/components/MobileBottomNav";

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: string;
  sortBy: string;
  discountRanges: string[];
  sortOrder: string;
}

interface Brand {
  BrandId?: string;
  brandId?: string;
  BrandName?: string;
  brandName?: string;
  Category?: string;
  category?: string;
}


// Add this custom hook BEFORE the Brands component
function useSearchParams() {
  const [searchParams, setSearchParams] = useState(window.location.search);

  useEffect(() => {
    const handleLocationChange = () => {
      setSearchParams(window.location.search);
    };

    window.addEventListener('popstate', handleLocationChange);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      handleLocationChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return searchParams;
}




export default function Brands() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
const searchInputRef = useRef<HTMLInputElement>(null);
const suggestionsRef = useRef<HTMLDivElement>(null);
const [, navigate] = useLocation();

// Close suggestions when clicking outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node) &&
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  // Get category from URL if present
  const [currentLocation] = useLocation();
  const searchParams = useSearchParams();
  console.log('🌐 Full URL:', window.location.href);
  console.log('🌐 Wouter location:', currentLocation);
  console.log('🌐 Search params:', window.location.search);
  const urlParams = new URLSearchParams(currentLocation.split('?')[1] || '');
  const categoryFromUrl = urlParams.get('categories');

  const [filters, setFilters] = useState<FilterState>({
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    brands: [],
    priceRange: "all",
    sortBy: "Popularity",
    discountRanges: [],
    sortOrder: "none",
  });

  const itemsPerPage = 48; // 8 rows × 6 columns


  const { data, isLoading, isError } = useBrands();
  const { data: filterMeta, isLoading: metaLoading } = useFilterMeta();

  // Backend search query - only triggered when user presses Enter
  const { data: searchResults, isLoading: searchLoading } = useBrandSearch(submittedSearchQuery);

  const safeBrands = Array.isArray(data) ? data : [];

// Filter brands based on search query for suggestions
const filteredBrandSuggestions = useMemo(() => {
  let results = safeBrands;
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    results = safeBrands.filter((brand: Brand) => {
      const brandName = brand.BrandName || brand.brandName || "";
      return brandName.toLowerCase().includes(query);
    });
  }

  // ✅ Sort alphabetically, moving number-starting names to the end
  return results.sort((a: Brand, b: Brand) => {
    const nameA = (a.BrandName || a.brandName || "").trim();
    const nameB = (b.BrandName || b.brandName || "").trim();
    
    const startsWithNumberA = /^\d/.test(nameA);
    const startsWithNumberB = /^\d/.test(nameB);
    
    if (startsWithNumberA && !startsWithNumberB) return 1;
    if (!startsWithNumberA && startsWithNumberB) return -1;
    
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
  });
}, [safeBrands, searchQuery]);


  // Use meta data from API
  const availableCategories = filterMeta?.categories ?? [];
  const availableBrands = filterMeta?.brands ?? [];
  const availablePriceRanges = filterMeta?.priceRanges ?? [];
  const availableSortOptions = filterMeta?.sortOptions ?? ["Popularity"];


  // Helper to convert display name to backend value
  const mapSortByToBackend = (displayName: string): string => {
    switch (displayName) {
      case "Price: Low to High":
        return "price-low";
      case "Price: High to Low":
        return "price-high";
      case "Brand: A to Z":
        return "brand-az";
      case "Brand: Z to A":
        return "brand-za";
      case "Popularity":
      default:
        return "popularity";
    }
  };

  // Helper to get min/max from selected price range
  const getPriceRangeValues = (
    rangeLabel: string
  ): { min: number | null; max: number | null } => {
    if (rangeLabel === "all") {
      return { min: null, max: null };
    }

    const selectedRange = availablePriceRanges.find(
      (r) => r.label === rangeLabel
    );
    return selectedRange
      ? { min: selectedRange.min, max: selectedRange.max }
      : { min: null, max: null };
  };

  const filterRequestBody = useMemo(() => {
    const priceRange = getPriceRangeValues(filters.priceRange);

    return {
      categories: filters.categories,
      brands: filters.brands,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: mapSortByToBackend(filters.sortBy),
      discountRanges: filters.discountRanges,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categories, filters.brands, filters.priceRange, filters.sortBy, filters.discountRanges]);

  // Call backend filter API
  const { data: filteredData, isLoading: filterLoading } =
    useFilteredBrands(filterRequestBody);

  // Determine which data to use: search results or filtered results
  const displayBrands = useMemo(() => {
    // If there's a submitted search query, use search results from backend
    if (submittedSearchQuery.trim()) {
      return Array.isArray(searchResults) ? searchResults : [];
    }

    // Otherwise use filtered results
    return Array.isArray(filteredData) ? filteredData : [];
  }, [submittedSearchQuery, searchResults, filteredData]);

// Frontend sorting logic
const sortedDisplayBrands = useMemo(() => {
  const brands = [...displayBrands as any[]];
  
  // Helper function for alphabetical sorting with numbers at the end
  const sortAlphabetically = (a: any, b: any) => {
    const nameA = (a.brandName || a.BrandName || "").trim();
    const nameB = (b.brandName || b.BrandName || "").trim();
    
    const startsWithNumberA = /^\d/.test(nameA);
    const startsWithNumberB = /^\d/.test(nameB);
    
    // If one starts with number and other doesn't, number goes last
    if (startsWithNumberA && !startsWithNumberB) return 1;
    if (!startsWithNumberA && startsWithNumberB) return -1;
    
    // Both start with letter or both start with number - sort alphabetically
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
  };
  
  switch (filters.sortOrder) {
    case "a-z":
      return brands.sort(sortAlphabetically);
    
    case "z-a":
      return brands.sort((a, b) => {
        const nameA = (a.brandName || a.BrandName || "").trim();
        const nameB = (b.brandName || b.BrandName || "").trim();
        
        const startsWithNumberA = /^\d/.test(nameA);
        const startsWithNumberB = /^\d/.test(nameB);
        
        // If one starts with number and other doesn't, number goes last
        if (startsWithNumberA && !startsWithNumberB) return 1;
        if (!startsWithNumberA && startsWithNumberB) return -1;
        
        // Both start with letter or both start with number - sort Z to A
        return nameB.localeCompare(nameA, undefined, { sensitivity: 'base' });
      });
    
    case "discount-high-low":
      return brands.sort((a, b) => {
        const discountA = parseFloat(a.discount || a.Discount || "0");
        const discountB = parseFloat(b.discount || b.Discount || "0");
        return discountB - discountA;
      });
    
    case "discount-low-high":
      return brands.sort((a, b) => {
        const discountA = parseFloat(a.discount || a.Discount || "0");
        const discountB = parseFloat(b.discount || b.Discount || "0");
        return discountA - discountB;
      });
    
    case "none":
    default:
      // ✅ DEFAULT: Always sort alphabetically A-Z with numbers at end
      return brands.sort(sortAlphabetically);
  }
}, [displayBrands, filters.sortOrder]);

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.priceRange !== "all" ? 1 : 0) +
    filters.discountRanges.length;

  // Pagination
  const pageCount = Math.ceil(sortedDisplayBrands.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBrands = sortedDisplayBrands.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchToggle = () => {
  setShowSuggestions(prev => !prev);
};

const handleBrandClick = (brand: Brand) => {
  const brandId = brand.BrandId || brand.brandId;
  if (brandId) {
    navigate(`/brands/${brandId}`);
    setSearchQuery("");
    setShowSuggestions(false);
  }
};


  const handleSearchSubmit = () => {
    setSubmittedSearchQuery(searchQuery);
    setCurrentPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { query } = useQueryLocation();
  const brandFilter = new URLSearchParams(query).get("brand");

  // Handle category filter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const categoryParam = urlParams.get('categories');

    setFilters(prev => {
      const currentCategory = prev.categories[0];

      if (categoryParam && categoryParam !== currentCategory) {
        return { ...prev, categories: [categoryParam] };
      } else if (!categoryParam && prev.categories.length > 0) {
        return { ...prev, categories: [] };
      }

      return prev;
    });

    if (categoryParam) {
      setCurrentPage(0);
    }
  }, [searchParams]);  // ✅ Watch window.location.search instead

  // ADD THIS USEEFFECT after the category filter useEffect (around line 175)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam && searchParam.trim()) {
      if (searchParam !== submittedSearchQuery) {
        setSearchQuery(searchParam);
        setSubmittedSearchQuery(searchParam);
        setCurrentPage(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);




  useEffect(() => {
    if (brandFilter) {
      setFilters((prev) => ({
        ...prev,
        brands: [brandFilter],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandFilter]);

  useEffect(() => {
    if (brandFilter) {
      setCurrentPage(0);
    }
  }, [brandFilter]);

  // Show loading state when searching or filtering
  const isLoadingState = isLoading || metaLoading || filterLoading || searchLoading;

  if (isLoadingState && !displayBrands.length) {
    return <BrandsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Failed to load brands
            </h3>
            <p className="text-muted-foreground mb-4">
              Please try again later or refresh the page
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />

      <main className="flex-1">
        {/* HERO HEADER SECTION */}
        <section className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                All Brands
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Browse gift vouchers from{" "}
                <span className="font-semibold text-primary">
                  {safeBrands.length} premium brands
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* FILTER BUTTON & SELECTED FILTERS - MOBILE ONLY */}
        <div className="lg:hidden px-4 py-3 bg-background border-b border-border sticky top-16 z-30">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Selected Category Chip */}
            {filters.categories.length > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                <span>{filters.categories[0]}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Selected Brand Chips */}
            {filters.brands.map((brand) => (
              <div
                key={brand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{brand}</span>
                <button
                  onClick={() => {
                    const newBrands = filters.brands.filter(b => b !== brand);
                    setFilters(prev => ({ ...prev, brands: newBrands }));
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Price Range Chip */}
            {filters.priceRange !== "all" && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                <span>{filters.priceRange}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: "all" }))}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Discount Range chips */}
{filters.discountRanges.map((discount) => (
  <button
    key={discount}
    onClick={() => {
      setFilters({
        ...filters,
        discountRanges: filters.discountRanges.filter((d) => d !== discount),
      });
    }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
  >
    <span>{discount}</span>
    <X className="h-3 w-3" />
  </button>
))}


          </div>
        </div>

        {/* SEARCH BAR - DESKTOP ONLY */}
        <div className="hidden lg:block bg-background border-b border-border sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
<div className="relative flex-1">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
  <Input
    ref={searchInputRef}
    type="text"
    placeholder="Search by brand name or category... (Press Enter)"
    value={searchQuery}
    onChange={(e) => {
      handleSearchChange(e);
      setShowSuggestions(true); // Show when typing
    }}
    onClick={handleSearchToggle}
    onKeyPress={handleKeyPress}
    className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
  />

  {/* Suggestions Dropdown */}
  {showSuggestions && filteredBrandSuggestions.length > 0 && (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl max-h-[40vh] overflow-y-auto z-[999]"
    >
      {filteredBrandSuggestions.map((brand: Brand, index: number) => {
        const brandName = brand.BrandName || brand.brandName || "";
        const brandCategory = brand.Category || brand.category || "";

        return (
          <button
            key={`${brand.BrandId || brand.brandId}-${index}`}
            onClick={() => handleBrandClick(brand)}
            className="w-full px-4 py-3 text-left hover:bg-muted active:bg-muted/50 transition-colors border-b border-border last:border-0 flex flex-col gap-1"
          >
            <span className="text-sm font-medium">{brandName}</span>
            {brandCategory && (
              <span className="text-xs text-muted-foreground">{brandCategory}</span>
            )}
          </button>
        );
      })}
    </div>
  )}
</div>

              <Button
                onClick={handleSearchSubmit}
                size="lg"
                className="px-6"
              >
                Search
              </Button>
            </div>
          </div>
        </div>


        {/* MAIN CONTENT WITH SIDEBAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* FILTER SIDEBAR - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-32">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableCategories={availableCategories}
                  availableBrands={availableBrands}
                  availablePriceRanges={availablePriceRanges}
                  availableSortOptions={availableSortOptions}
                  availableDiscountRanges={filterMeta?.discountRanges || []}
                />
              </div>
            </aside>

            {/* FILTER MODAL - Mobile Full Screen */}
            <div className="lg:hidden">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                availablePriceRanges={availablePriceRanges}
                availableSortOptions={availableSortOptions}
                availableDiscountRanges={filterMeta?.discountRanges || []}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                isMobile={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                allBrandsData={displayBrands}
              />
            </div>


            {/* BRANDS GRID */}
            <div className="flex-1 min-w-0">
              {/* Results Count */}
              {sortedDisplayBrands.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Showing{" "}
                    <span className="text-foreground font-semibold">
                      {startIndex + 1}-
                      {Math.min(endIndex, sortedDisplayBrands.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-semibold">
                      {sortedDisplayBrands.length}
                    </span>{" "}
                    brands
                    {submittedSearchQuery.trim() && (
                      <span className="ml-2 text-primary">
                        (searching for "{submittedSearchQuery}")
                      </span>
                    )}
                    {!submittedSearchQuery.trim() && activeFiltersCount > 0 && (
                      <span className="ml-2 text-primary">
                        ({activeFiltersCount} filter
                        {activeFiltersCount !== 1 ? "s" : ""} active)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Brand Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 auto-rows-fr">
                {currentBrands.map((brand) => {
                  // Parse the image JSON string
                  let imageUrl = null;
                  const imageData = 'image' in brand ? brand.image : ('Image' in brand ? (brand as any).Image : null);

                  if (imageData) {
                    try {
                      const parsedImage = JSON.parse(imageData);
                      imageUrl = parsedImage.text || parsedImage.raw || parsedImage.thumbnail || parsedImage.featured || parsedImage.base || null;
                    } catch (e) {
                      const brandNameData = 'brandName' in brand ? brand.brandName : ('BrandName' in brand ? (brand as any).BrandName : 'Unknown');
                      console.error('Failed to parse image for brand:', brandNameData, e);
                    }
                  }

                  // Handle both camelCase (search results) and PascalCase (filtered results)
                  const brandId = 'brandId' in brand ? brand.brandId : (brand as any).BrandId;
                  const brandName = 'brandName' in brand ? brand.brandName : (brand as any).BrandName;
                  const category = 'category' in brand ? brand.category : (brand as any).Category;
                  const discount = 'discount' in brand ? brand.discount : (brand as any).Discount;

                  return (
                    <BrandCard
                      key={brandId}
                      brand={{
                        BrandId: brandId,
                        BrandName: brandName,
                        Category: category,
                        Images: imageUrl ? {
                          text: imageUrl,
                          thumbnail: imageUrl,
                          featured: imageUrl,
                          base: imageUrl,
                          mobile: imageUrl,
                          small: imageUrl
                        } : null,
                        Discount: discount
                      }}
                    />
                  );
                })}
              </div>

              {/* No Results */}
              {sortedDisplayBrands.length === 0 && (
                <div className="text-center py-16 lg:py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No brands found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {submittedSearchQuery.trim()
                      ? `No results found for "${submittedSearchQuery}"`
                      : "Try adjusting your filters or search term"
                    }
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSubmittedSearchQuery("");
                      setFilters({
                        categories: [],
                        brands: [],
                        priceRange: "all",
                        sortBy: "Popularity",
                        discountRanges: [],
                        sortOrder: "none",
                      });
                    }}
                  >
                    Clear all {submittedSearchQuery.trim() ? "search and filters" : "filters"}
                  </Button>
                </div>
              )}

              {/* PAGINATION */}
              {sortedDisplayBrands.length > itemsPerPage && (
                <div className="mt-12 lg:mt-16 flex justify-center">
                  <ReactPaginate
                    previousLabel={
                      <span className="flex items-center justify-center w-full h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </span>
                    }
                    nextLabel={
                      <span className="flex items-center justify-center w-full h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    }
                    breakLabel={
                      <span className="flex items-center justify-center w-full h-full">
                        ...
                      </span>
                    }
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    containerClassName="flex items-center justify-center gap-2 flex-wrap"
                    pageClassName="block"
                    pageLinkClassName="flex items-center justify-center min-w-[2.75rem] h-11 px-3 text-sm font-medium rounded-xl border-2 border-border bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
                    activeClassName="[&>a]:bg-primary [&>a]:text-primary-foreground [&>a]:border-primary [&>a]:shadow-md [&>a]:font-semibold"
                    previousClassName="block"
                    previousLinkClassName="flex items-center justify-center w-11 h-11 rounded-xl border-2 border-border bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
                    nextClassName="block"
                    nextLinkClassName="flex items-center justify-center w-11 h-11 rounded-xl border-2 border-border bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
                    breakClassName="block"
                    breakLinkClassName="flex items-center justify-center min-w-[2.75rem] h-11 px-3 text-sm font-medium text-muted-foreground cursor-default"
                    disabledClassName="opacity-40 cursor-not-allowed pointer-events-none"
                    disabledLinkClassName="opacity-40 cursor-not-allowed"
                    renderOnZeroPageCount={null}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}