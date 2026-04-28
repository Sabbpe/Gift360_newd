// src/components/FilterSidebar.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiscountRange, PriceRange } from "@/types/filterMeta";
import { useLocation } from "wouter";

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: string;
  sortBy: string;
  discountRanges: string[];
  sortOrder: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableBrands: string[];
  availablePriceRanges: PriceRange[];
  availableSortOptions: string[];
  availableDiscountRanges: DiscountRange[];
  isOpen?: boolean;
  onClose?: () => void;
  // Mobile-specific props
  isMobile?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  // Brand data with details (for navigation)
  allBrandsData?: Array<{
    BrandId?: string;
    brandId?: string;
    BrandName?: string;
    brandName?: string;
    Category?: string;
    category?: string;
  }>;
}

const FilterSection = ({
  title,
  section,
  children,
  expandedSections,
  toggleSection,
}: {
  title: string;
  section: 'categories' | 'brands' | 'price' | 'sort' | 'discount' | 'sortOrder';
  children: React.ReactNode;
  expandedSections: {
    categories: boolean;
    brands: boolean;
    price: boolean;
    sort: boolean;
    discount: boolean;
    sortOrder: boolean;
  };
  toggleSection: (section: 'categories' | 'brands' | 'price' | 'sort' | 'discount' | 'sortOrder') => void;
}) => (
  <div className="border-b border-border last:border-0">
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-4 px-1 hover:bg-muted/50 transition-colors"
    >
      <h3 className="font-semibold text-base">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
    {expandedSections[section] && (
      <div className="pb-4 px-1 space-y-3">{children}</div>
    )}
  </div>
);


export default function FilterSidebar({
  filters,
  onFilterChange,
  availableCategories,
  // availableBrands,
  availablePriceRanges,
  availableSortOptions,
  availableDiscountRanges,
  isOpen = true,
  onClose,
  isMobile = false,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  allBrandsData = [],
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: false,
    price: false,
    sort: false,
    discount: false,
    sortOrder: false,
  });

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
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

// Filter brands based on selected category
const filteredBrandSuggestions = useMemo(() => {
  const selectedCategory = filters.categories[0];

  // Filter brands by category if one is selected
  let brandsToShow = allBrandsData;

  if (selectedCategory) {
    brandsToShow = allBrandsData.filter((brand) => {
      const brandCategory = brand.Category || brand.category || "";
      return brandCategory === selectedCategory;
    });
  }

  // Further filter by search query if exists
  if (localSearchQuery.trim()) {
    const query = localSearchQuery.toLowerCase();
    brandsToShow = brandsToShow.filter((brand) => {
      const brandName = brand.BrandName || brand.brandName || "";
      return brandName.toLowerCase().includes(query);
    });
  }

  // ✅ Sort alphabetically, moving number-starting names to the end
  return brandsToShow.sort((a, b) => {
    const nameA = (a.BrandName || a.brandName || "").trim();
    const nameB = (b.BrandName || b.brandName || "").trim();
    
    const startsWithNumberA = /^\d/.test(nameA);
    const startsWithNumberB = /^\d/.test(nameB);
    
    if (startsWithNumberA && !startsWithNumberB) return 1;
    if (!startsWithNumberA && startsWithNumberB) return -1;
    
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
  });
}, [allBrandsData, filters.categories, localSearchQuery]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (category: string) => {
    const newCategories = filters.categories[0] === category ? [] : [category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleDiscountToggle = (discountRange: string) => {
    const newDiscountRanges = filters.discountRanges.includes(discountRange)
      ? filters.discountRanges.filter((d) => d !== discountRange)
      : [...filters.discountRanges, discountRange];

    onFilterChange({
      ...filters,
      discountRanges: newDiscountRanges,
    });
  };


  // const handleBrandToggle = (brand: string) => {
  //   const newBrands = filters.brands.includes(brand)
  //     ? filters.brands.filter((b) => b !== brand)
  //     : [...filters.brands, brand];
  //   onFilterChange({ ...filters, brands: newBrands });
  // };

  const handleReset = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: "all",
      sortBy: availableSortOptions[0] || "Popularity",
      discountRanges: [],
      sortOrder: "none",
    });

    if (onSearchChange) {
      setLocalSearchQuery("");
      onSearchChange("");
    }
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleBrandClick = (brand: typeof allBrandsData[0]) => {
    const brandId = brand.BrandId || brand.brandId;
    if (brandId) {
      // Navigate to brand detail page
      navigate(`/brands/${brandId}`);

      // Clear search and close modal
      setLocalSearchQuery("");
      if (onSearchChange) {
        onSearchChange("");
      }
      setShowSuggestions(false);

      // Close the filter modal
      if (onClose) {
        onClose();
      }
    }
  };

  const handleLocalSearchSubmit = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    }
    setShowSuggestions(false);
  };

  // Mobile Full-Screen Overlay
  if (isMobile && isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-[70] lg:hidden flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background">
            <h2 className="text-lg font-bold">Filters & Sort</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar with Suggestions - Inside Filter on Mobile */}
          <div className="p-4 border-b border-border bg-background relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by brands"
                value={localSearchQuery}
                onChange={handleLocalSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLocalSearchSubmit();
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredBrandSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
                >
                  {filteredBrandSuggestions.map((brand, index) => {
                    const brandName = brand.BrandName || brand.brandName || "";
                    const brandCategory = brand.Category || brand.category || "";

                    return (
                      <button
                        key={index}
                        onClick={() => handleBrandClick(brand)}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0 flex flex-col gap-1"
                      >
                        <span className="text-sm font-medium">{brandName}</span>
                        {brandCategory && (
                          <span className="text-xs text-muted-foreground">
                            {brandCategory}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Reset All
              </Button>
              {/* Sorting Section Heading */}
              {/* <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-foreground">Sorting</h3>
              </div> */}
              {/* Sort By Section */}
              <FilterSection
                title="Sort By"
                section="sortOrder"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-4">
                  {/* Sort Brands Subsection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Sort Brands</h4>
                    <RadioGroup
                      value={filters.sortOrder}
                      onValueChange={(value) =>
                        onFilterChange({ ...filters, sortOrder: value })
                      }
                    >
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a-z" id="sort-az-mobile" />
                          <Label htmlFor="sort-az-mobile" className="text-sm">
                            A to Z
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="z-a" id="sort-za-mobile" />
                          <Label htmlFor="sort-za-mobile" className="text-sm">
                            Z to A
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Discount Subsection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Discount</h4>
                    <RadioGroup
                      value={filters.sortOrder}
                      onValueChange={(value) =>
                        onFilterChange({ ...filters, sortOrder: value })
                      }
                    >
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="discount-high-low" id="sort-high-mobile" />
                          <Label htmlFor="sort-high-mobile" className="text-sm">
                            High to Low
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="discount-low-high" id="sort-low-mobile" />
                          <Label htmlFor="sort-low-mobile" className="text-sm">
                            Low to High
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Default Option */}
                  {/* <div className="space-y-2 pt-2 border-t border-border">
                    <RadioGroup
                      value={filters.sortOrder}
                      onValueChange={(value) =>
                        onFilterChange({ ...filters, sortOrder: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="sort-none-mobile" />
                        <Label htmlFor="sort-none-mobile" className="text-sm">
                          Default (No Sorting)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div> */}
                </div>
              </FilterSection>

              {/* Brands */}
              {/* <FilterSection title="Brands" section="brands" expandedSections={expandedSections}
                toggleSection={toggleSection}>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2.5 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded border-border text-primary"
                      />
                      <span className="text-sm flex-1">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection> */}

              <div className="px-1 py-4 border-b">
                <h3 className="text-sm font-bold text-foreground">Filter By</h3>
              </div>

              {/* Price Range */}
              <FilterSection title="Price Range" section="price" expandedSections={expandedSections}
                toggleSection={toggleSection}>
                <RadioGroup
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, priceRange: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" />
                    <Label htmlFor="price-all">All Prices</Label>
                  </div>

                  {availablePriceRanges.map((range, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={range.label} id={`price-${i}`} />
                      <Label htmlFor={`price-${i}`}>{range.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FilterSection>

              {/* Discount Ranges Section - ✅ ADD THIS ENTIRE SECTION */}
              <FilterSection
                title="Discount Ranges"
                section="discount"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-2">
                  {availableDiscountRanges.map((discountRange, index) => (
                    <div key={`discount-${index}`} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`discount-${index}`}
                        checked={filters.discountRanges.includes(discountRange.label)}
                        onChange={() => handleDiscountToggle(discountRange.label)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor={`discount-${index}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {discountRange.label}  {/* ✅ ADD .label */}
                      </Label>
                    </div>
                  ))}

                </div>
              </FilterSection>
              {/* Categories */}
              <FilterSection title="Categories" section="categories" expandedSections={expandedSections}
                toggleSection={toggleSection}>
                <RadioGroup
                  value={filters.categories[0] || ""}
                  onValueChange={(value) => handleCategorySelect(value)}
                >
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      >
                        <RadioGroupItem value={category} id={`desktop-cat-${category}`} />
                        <Label
                          htmlFor={`desktop-cat-${category}`}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </FilterSection>

            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-background space-y-2 pb-20 md:pb-4">
            <Button
              onClick={() => {
                handleLocalSearchSubmit();
                onClose?.();
              }}
              className="w-full"
              size="lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar (Original)
  return (
    <div
      className={`${isOpen ? "block" : "hidden"
        } lg:block bg-background border-r border-border h-full`}
    >
      <div className="sticky top-0 bg-background z-10 border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters & Sort</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-1">
          {/* Reset Button - Moved to Top */}
          <div className="pb-4">
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
          {/* Sorting Section Heading */}
          {/* <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-foreground">Sorting</h3>
          </div> */}
          {/* Sort By Section */}
          <FilterSection
            title="Sort By"
            section="sortOrder"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div className="space-y-4">
              {/* Sort Brands Subsection */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Sort Brands</h4>
                <RadioGroup
                  value={filters.sortOrder}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, sortOrder: value })
                  }
                >
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a-z" id="sort-az" />
                      <Label htmlFor="sort-az" className="text-sm">
                        A to Z
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="z-a" id="sort-za" />
                      <Label htmlFor="sort-za" className="text-sm">
                        Z to A
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Discount Subsection */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Discount</h4>
                <RadioGroup
                  value={filters.sortOrder}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, sortOrder: value })
                  }
                >
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discount-high-low" id="sort-high" />
                      <Label htmlFor="sort-high" className="text-sm">
                        High to Low
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discount-low-high" id="sort-low" />
                      <Label htmlFor="sort-low" className="text-sm">
                        Low to High
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Default Option */}
              {/* <div className="space-y-2 pt-2 border-t border-border">
                <RadioGroup
                  value={filters.sortOrder}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, sortOrder: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="sort-none" />
                    <Label htmlFor="sort-none" className="text-sm">
                      Default (No Sorting)
                    </Label>
                  </div>
                </RadioGroup>
              </div> */}
            </div>
          </FilterSection>

          {/* Brands */}
          {/* <FilterSection title="Brands" section="brands" expandedSections={expandedSections}
            toggleSection={toggleSection}>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-border text-primary"
                  />
                  <span className="text-sm flex-1">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection> */}

          {/* Filtering Section Heading */}
          <div className="px-1 py-4 border-b">
            <h3 className="text-sm font-bold text-foreground">Filter By</h3>
          </div>

          {/* Price Range */}
          <FilterSection title="Price Range" section="price" expandedSections={expandedSections}
            toggleSection={toggleSection}>
            <RadioGroup
              value={filters.priceRange}
              onValueChange={(value) =>
                onFilterChange({ ...filters, priceRange: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="price-all" />
                <Label htmlFor="price-all">All Prices</Label>
              </div>

              {availablePriceRanges.map((range, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={range.label} id={`price-${i}`} />
                  <Label htmlFor={`price-${i}`}>{range.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          {/* Discount Ranges Section - ✅ ADD THIS ENTIRE SECTION */}
          <FilterSection
            title="Discount Ranges"
            section="discount"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div className="space-y-2">
              {availableDiscountRanges.map((discountRange, index) => (
                <div key={`discount-${index}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`discount-${index}`}
                    checked={filters.discountRanges.includes(discountRange.label)}
                    onChange={() => handleDiscountToggle(discountRange.label)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor={`discount-${index}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {discountRange.label}  {/* ✅ ADD .label */}
                  </Label>
                </div>
              ))}


            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Categories" section="categories" expandedSections={expandedSections}
            toggleSection={toggleSection}>
            <RadioGroup
              value={filters.categories[0] || ""}
              onValueChange={(value) => handleCategorySelect(value)}
            >
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    <RadioGroupItem value={category} id={`desktop-cat-${category}`} />
                    <Label
                      htmlFor={`desktop-cat-${category}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </FilterSection>

        </div>
      </ScrollArea>
    </div>
  );
}
