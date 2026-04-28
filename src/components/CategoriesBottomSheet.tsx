import { X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFilterMeta } from '@/hooks/useFilterMeta';
import { useState, useEffect } from 'react';

interface CategoriesBottomSheetProps {
    open: boolean;
    onClose: () => void;
}

export default function CategoriesBottomSheet({ open, onClose }: CategoriesBottomSheetProps) {
    const [location, setLocation] = useLocation();
    const { data: filterMeta, isLoading } = useFilterMeta();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = filterMeta?.categories || [];

    // Read selected category from URL only when sheet opens
    useEffect(() => {
        if (open) {
            const params = new URLSearchParams(window.location.search);
            const categoryParam = params.get('categories');
            setSelectedCategory(categoryParam); // Will be null if no category in URL
        }
    }, [open, location]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        const params = new URLSearchParams();
        params.set('categories', category);
        setLocation(`/brands?${params.toString()}`);
        onClose();
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-[70] md:hidden flex flex-col animate-slide-up" style={{ maxHeight: 'calc(80vh - 64px)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-bold">Categories</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Categories List - Scrollable with bottom padding */}
                <div className="overflow-y-auto flex-1 pb-20">
                    {isLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Loading categories...
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="divide-y divide-border">
                            {categories.map((category, index) => {
                                const isSelected = selectedCategory === category;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`w-full text-left px-6 py-4 transition-colors flex items-center justify-between group ${
                                            isSelected 
                                                ? 'bg-purple-50 hover:bg-purple-100' 
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <span className={`text-base font-medium transition-colors ${
                                            isSelected 
                                                ? 'text-purple-600' 
                                                : 'text-foreground group-hover:text-primary'
                                        }`}>
                                            {category}
                                        </span>
                                        <svg
                                            className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                                                isSelected 
                                                    ? 'text-purple-600' 
                                                    : 'text-muted-foreground group-hover:text-primary'
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            No categories available
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
