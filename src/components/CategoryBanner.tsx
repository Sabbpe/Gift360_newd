import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Offer {
    brand: string;
    cashback: string;
    image: string;
}

interface CategoryBannerProps {
    title: string;
    offers: Offer[];
}

export function CategoryBanner({ title, offers }: CategoryBannerProps) {
    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: 'start',
            slidesToScroll: 1,
        },
        [Autoplay({ delay: 3000, stopOnInteraction: true })]
    );

    return (
        <div className="mb-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b-2 border-purple-200 pb-3">
                {title}
            </h2>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                        >
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={offer.image}
                                        alt={offer.brand}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="mb-2 text-xl font-bold">{offer.brand}</h3>
                                        <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-full">
                                            <p className="text-white font-semibold">{offer.cashback}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}