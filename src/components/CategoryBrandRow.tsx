import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandCard from '@/components/BrandCard';
import type { Brand } from '@/types/brand';

interface CategoryBrandRowProps {
  category: string;
  brands: Brand[];
  isHighlighted?: boolean;
}

export default function CategoryBrandRow({ category, brands, isHighlighted = false }: CategoryBrandRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [brands]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });

      setTimeout(checkScrollability, 300);
    }
  };

  if (brands.length === 0) {
    return null;
  }

  const showArrows = brands.length > 4;

  return (
    <div className="space-y-3 md:space-y-0">
      {/* Mobile: Category Name on Top */}
      <div className="md:hidden">
        <h3 className="text-lg font-bold text-foreground mb-1">{category}</h3>
        <p className="text-sm text-muted-foreground">
          {brands.length} brand{brands.length !== 1 ? 's' : ''} available
        </p>
      </div>

{/* MOBILE LAYOUT: Horizontal Scroll - No Vertical Stacking */}
<div className="md:hidden">
  <div 
    className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent scroll-smooth pb-2"
    style={{
      scrollBehavior: 'smooth',
    }}
  >
    {brands.map((brand) => (
      <div key={brand.BrandId} className="flex-shrink-0 w-[170px] min-w-[170px]">
        <BrandCard 
          brand={brand} 
        />
      </div>
    ))}
  </div>
</div>


      {/* DESKTOP LAYOUT: Horizontal Scrolling with Arrows */}
      <div className="hidden md:flex gap-4 items-center">
        {/* Desktop: Category Box */}
        <div className={`flex flex-col items-center justify-center bg-gradient-to-br rounded-2xl p-6 w-[200px] lg:w-[220px] h-[200px] lg:h-[220px] flex-shrink-0 transition-all duration-300 group ${
          isHighlighted
            ? 'from-purple-500/20 to-pink-500/20 border-2 border-purple-500 shadow-xl shadow-purple-500/50 scale-105'
            : 'from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg hover:scale-105'
        }`}>
          <div className="text-center space-y-2">
            <h3 className={`text-xl lg:text-2xl font-bold transition-colors ${
              isHighlighted 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-foreground group-hover:text-primary'
            }`}>
              {category}
            </h3>
            <p className="text-sm text-muted-foreground">
              {brands.length} brand{brands.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Left Arrow */}
        {showArrows && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Scrollable Brand Cards - Desktop Only */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-3 sm:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-none pb-4"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {brands.map((brand) => (
            <div
              key={brand.BrandId}
              className="flex-shrink-0 w-[175px] min-h-[175px] sm:w-[200px] sm:min-h-[200px] lg:w-[220px] lg:min-h-[220px] snap-start"
            >
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showArrows && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
