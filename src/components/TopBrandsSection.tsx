import { useMemo, useState, useEffect } from 'react';
import { useBrands } from '@/hooks/useBrands';
import CategoryBrandRow from './CategoryBrandRow';
import type { Brand } from '@/types/brand';

const FEATURED_CATEGORIES = [
  'Food & Beverages',
  'E-Commerce',
  'Fashion & Lifestyle',
  'Tour & Travel',
  'Gaming',
  'Wellness & Beauty',
  'Jewellery',
  'Entertainment',
  'Sports & Footwears'
];



export default function TopBrandsSection() {
  const { data: brands, isLoading, isError } = useBrands();
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

    // ✅ Clear highlighted category on page reload
  useEffect(() => {
    // Check if this is a fresh page load (not a hot reload in dev)
    const isPageReload = 
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';

    
    if (isPageReload) {
      localStorage.removeItem('highlightCategory');
      setHighlightedCategory(null);
    }
  }, []); // Run only once on mount

// ✅ Listen for category selection from CategoriesSection
useEffect(() => {
  const checkHighlight = () => {
    const category = localStorage.getItem('highlightCategory');
    
    if (category) {
      setHighlightedCategory(category);
      
      // Show animation only for 2 seconds on initial click
      if (highlightedCategory !== category) {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
      }
    } else {
      setHighlightedCategory(null);
      setShowAnimation(false);
    }
  };

  // Check immediately
  checkHighlight();

  // Listen for storage changes (when category is clicked)
  window.addEventListener('storage', checkHighlight);
  
  // Also use interval to check (for same-tab updates)
  const interval = setInterval(checkHighlight, 100);

  return () => {
    window.removeEventListener('storage', checkHighlight);
    clearInterval(interval);
  };
}, [highlightedCategory]);


  const brandsByCategory = useMemo(() => {
    if (!brands || !Array.isArray(brands)) return {};

    const categoryMap: Record<string, Brand[]> = {};

    brands.forEach((brand) => {
      const category = brand.Category;
      if (!category) return;

      // Normalize category name for matching
      const normalizedCategory = category.trim();

      // Find matching featured category (case-insensitive partial match)
      const matchedCategory = FEATURED_CATEGORIES.find(featCat =>
        normalizedCategory.toLowerCase().includes(featCat.toLowerCase()) ||
        featCat.toLowerCase().includes(normalizedCategory.toLowerCase())
      );

      if (matchedCategory) {
        if (!categoryMap[matchedCategory]) {
          categoryMap[matchedCategory] = [];
        }
        categoryMap[matchedCategory].push(brand);
      }
    });

    return categoryMap;
  }, [brands]);

// ✅ Reorder categories to show selected/highlighted category first
const orderedCategories = useMemo(() => {
  // Check if there's a highlighted category (from manual click)
  if (highlightedCategory && FEATURED_CATEGORIES.includes(highlightedCategory)) {
    return [
      highlightedCategory,
      ...FEATURED_CATEGORIES.filter(cat => cat !== highlightedCategory)
    ];
  }
  
  // Check if there are preselected categories from onboarding
  const selectedCategories = localStorage.getItem('selectedCategories');
  if (selectedCategories) {
    try {
      const categories = JSON.parse(selectedCategories);
      if (categories.length > 0 && FEATURED_CATEGORIES.includes(categories[0])) {
        // Show first preselected category at top
        return [
          categories[0],
          ...FEATURED_CATEGORIES.filter(cat => cat !== categories[0])
        ];
      }
    } catch (e) {
      console.error('Failed to parse selectedCategories', e);
    }
  }
  
  return FEATURED_CATEGORIES;
}, [highlightedCategory]);


  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
            Top Brands by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Discover premium brands across different categories
          </p> */}

          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 mb-6">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="w-[220px] h-[220px] bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-destructive">Unable to load brands at this time</p>
        </div>
      </section>
    );
  }

  const hasAnyBrands = Object.values(brandsByCategory).some(brands => brands.length > 0);

  if (!hasAnyBrands) {
    return null;
  }

  return (
    <section id="top-brands-section" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
          Top Brands by Category
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
          Discover premium brands across different categories
        </p> */}

        <div className="space-y-8 sm:space-y-12">
          {orderedCategories.map((category) => {
            const categoryBrands = brandsByCategory[category];
            if (!categoryBrands || categoryBrands.length === 0) return null;

            const isHighlighted = category === highlightedCategory && showAnimation;

            return (
              <div
                key={category}
                className={`transition-all duration-500 ${
                  isHighlighted
                    ? 'animate-highlight-pulse'
                    : ''
                }`}
              >
                <CategoryBrandRow
                  category={category}
                  brands={categoryBrands}
                  isHighlighted={isHighlighted}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
