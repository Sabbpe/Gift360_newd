import Marquee from 'react-fast-marquee';
import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Offer {
    brand: string;
    cashback: string;
    image: string;
    link?: string;
}

interface MovingBannerProps {
    offers: Offer[];
    speed?: number;
    pauseOnHover?: boolean;
}

export function MovingBanner({
    offers,
    speed = 50,
    pauseOnHover = true
}: MovingBannerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track scroll position to update current index
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !isMobile) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollLeft;
            const cardWidth = container.offsetWidth;
            const index = Math.round(scrollPosition / cardWidth);
            setCurrentIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    const handleOfferClick = (offer: Offer) => {
        if (offer.link) {
            window.location.href = offer.link;
        }
    };

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const cardWidth = container.offsetWidth;
        container.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    };

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : offers.length - 1;
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex < offers.length - 1 ? currentIndex + 1 : 0;
        scrollToIndex(newIndex);
    };

    // Mobile view - horizontal scroll with snap
    if (isMobile) {
        return (
            <div className="relative">
                {/* Navigation Arrows */}
                {offers.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 transition-all"
                            aria-label="Previous offer"
                        >
                            <ChevronLeft className="h-6 w-6 text-purple-600" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 transition-all"
                            aria-label="Next offer"
                        >
                            <ChevronRight className="h-6 w-6 text-purple-600" />
                        </button>

                    </>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                >
                    <div className="flex">
                        {offers.map((offer, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full snap-center snap-always px-2"
                                onClick={() => handleOfferClick(offer)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleOfferClick(offer);
                                    }
                                }}
                            >
                                <div className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                                    <img
                                        src={offer.image}
                                        alt={offer.brand}
                                        className="w-full h-[72px] object-contain bg-gray-900"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                                        <h3 className="text-white font-bold text-lg mb-1">{offer.brand}</h3>
                                        <p className="text-green-600 text-sm font-semibold">{offer.cashback}</p>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indicator Dots */}
                {offers.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                        {offers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'w-6 bg-purple-600'
                                    : 'w-2 bg-gray-300'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Desktop view - auto-scrolling marquee
    return (
        <Marquee speed={speed} pauseOnHover={pauseOnHover}>
            {offers.map((offer, index) => (
                <div
                    key={index}
                    className="mx-4 cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => handleOfferClick(offer)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleOfferClick(offer);
                        }
                    }}
                >
                    <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow w-64">
                        <img
                            src={offer.image}
                            alt={offer.brand}
                            className="w-full h-40 object-contain bg-gray-900"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                            <h3 className="text-white font-bold">{offer.brand}</h3>
                            <p className="text-green-400 text-sm">{offer.cashback}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                    </div>
                </div>
            ))}
        </Marquee>
    );
}