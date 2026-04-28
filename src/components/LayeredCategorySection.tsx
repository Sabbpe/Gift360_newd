import { useRef, useEffect, useState, type ReactNode } from 'react';

interface LayeredCategorySectionProps {
  index: number;
  isLast: boolean;
  children: ReactNode;
}

export default function LayeredCategorySection({
  index,
  isLast,
  children,
}: LayeredCategorySectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  // Constants
  const TOP_OFFSET = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 140; // Increased offset to prevent bottom clipping
  const BOTTOM_BUFFER = 40; // Space from bottom for tall content
  const BASE_Z_INDEX = 20; // Starting z-index

  // Track content height using ResizeObserver
  useEffect(() => {
    if (!contentRef.current) return;

    const measureContent = () => {
      if (contentRef.current) {
        const height = contentRef.current.offsetHeight;
        if (height > 0) {
          setContentHeight(height);
        }
      }
    };

    // Initial measurement
    measureContent();

    // Measure after short delay for dynamic content
    const timer = setTimeout(measureContent, 100);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0) {
          setContentHeight(height);
        }
      }
    });

    observer.observe(contentRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [children]);

  // Track viewport height on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate sticky position
  const stickyTop =
    contentHeight < viewportHeight - TOP_OFFSET
      ? TOP_OFFSET
      : Math.max(TOP_OFFSET, viewportHeight - contentHeight - BOTTOM_BUFFER);

  // Create scroll space (keeps element stuck longer)
  const wrapperHeight = contentHeight > 0 && viewportHeight > 0
    ? `${contentHeight + viewportHeight}px`
    : 'auto';

  // Create overlap effect (pull next section up) - use 75% to delay overlap and keep buttons visible
  const marginBottom = !isLast && contentHeight > 0 && viewportHeight > 0
    ? -(viewportHeight * 0.75)
    : 0;

  // Control stacking order (later sections appear on top)
  const zIndex = BASE_Z_INDEX + index;

  return (
    <div
      style={{
        height: wrapperHeight,
        marginBottom: `${marginBottom}px`,
        position: 'relative',
        zIndex,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: `${stickyTop}px`,
          backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50 to cover content below
          minHeight: `${viewportHeight}px`, // Cover full viewport height
          paddingBottom: '6rem', // Extra padding to ensure Quick Buy buttons are visible
        }}
        className="dark:bg-slate-900" // Dark mode background
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
