import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useConfig } from "@/contexts/ConfigContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, Rocket, Clock, ArrowRight, Gift } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function BlogPage() {
    const { config } = useConfig();

    useEffect(() => {
        document.title = "Blogs & Updates | Gift360 Gift Vouchers";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Stay updated with the latest gift voucher trends, upcoming offers, and site changelogs at Gift360.");
        }
    }, []);

    const [showMoreNews, setShowMoreNews] = useState(false);

    const fireNews = [
        {
            title: "The Rise of Digital Gifting in 2026",
            description: "How digital vouchers are transforming the way we celebrate special occasions.",
            date: "Jan 10, 2026",
            category: "Trends",
            image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Maximizing Rewards with Gift360 Vouchers",
            description: "A complete guide to getting the most value out of every purchase.",
            date: "Jan 08, 2026",
            category: "Guide",
            image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Security Tips for Online Voucher Shopping",
            description: "Protect your gift cards and personal information from common online scams.",
            date: "Jan 05, 2026",
            category: "Security",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Top 10 Gift Cards for Gamers in 2026",
            description: "Discover which gaming vouchers are trending this year among enthusiasts.",
            date: "Jan 03, 2026",
            category: "Gaming",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Sustainability in Digital Payments",
            description: "How eco-friendly initiatives are shaping the future of digital transactions.",
            date: "Jan 01, 2026",
            category: "Eco",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Global Gift Card Market Trends",
            description: "An analysis of the worldwide demand for prepaid and store cards.",
            date: "Dec 30, 2025",
            category: "Finance",
            image: "https://images.unsplash.com/photo-1611974717482-98aa03310705?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Corporate Gifting: New Strategies",
            description: "How businesses are using gift vouchers to boost employee morale effectively.",
            date: "Dec 28, 2025",
            category: "Business",
            image: "https://images.unsplash.com/photo-1521791136064-7986c29596ba?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "The Psychology of Gift Giving",
            description: "Why we choose certain vouchers and what it says about our relationships.",
            date: "Dec 25, 2025",
            category: "Lifestyle",
            image: "https://images.unsplash.com/photo-1512909002072-44205a32 visual?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Hidden Gems in our Voucher Collection",
            description: "Uncovering unique brands you might have missed in our latest catalog.",
            date: "Dec 22, 2025",
            category: "Discovery",
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const displayedNews = showMoreNews ? fireNews : fireNews.slice(0, 4);

    const upcomingUpdates = [
        {
            title: "New Luxury Brand Vouchers",
            date: "Expected: Feb 2026",
            status: "Coming Soon",
            icon: <Star className="w-5 h-5 text-yellow-500" />
        },
        {
            title: "Gift360 Mobile App Launch",
            date: "Expected: Q1 2026",
            status: "In Development",
            icon: <Rocket className="w-5 h-5 text-purple-500" />
        },
        {
            title: "Enhanced Wallet Integration",
            date: "Expected: Mar 2026",
            status: "Planned",
            icon: <Gift className="w-5 h-5 text-green-500" />
        },
        {
            title: "Referral Program 2.0",
            date: "Expected: Apr 2026",
            status: "Coming Soon",
            icon: <ArrowRight className="w-5 h-5 text-blue-500" />
        },
        {
            title: "International Brands Expansion",
            date: "Expected: May 2026",
            status: "Planned",
            icon: <Rocket className="w-5 h-5 text-orange-500" />
        },
        {
            title: "AI-Powered Recommendations",
            date: "Expected: June 2026",
            status: "Researching",
            icon: <Flame className="w-5 h-5 text-red-500" />
        }
    ];

    const changelogs = [
        { version: "v2.1.0", date: "Jan 2026", changes: ["Improved checkout flow", "Added dynamic hero banners", "Bug fixes for mobile navigation"] },
        { version: "v2.0.5", date: "Dec 2025", changes: ["Dark mode support", "Performance optimizations", "New filtering system"] }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {config.header.enabled && <Header />}

            <main className="flex-1 pb-16 md:pb-8">
                {/* HERO SECTION */}
                <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-background to-racing-red/10 border-b">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 text-center z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-racing-red"
                        >
                            Insights & Updates
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            Your daily dose of voucher news, upcoming offers, and site improvements.
                        </motion.p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                    {/* TRENDING UPDATES */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 md:mb-8">
                            <Flame className="w-6 h-6 md:w-8 md:h-8 text-racing-red animate-pulse" />
                            <h2 className="text-2xl md:text-3xl font-display font-bold">Trending Updates</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* FIRE NEWS (Left Part - 2/3) */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-semibold text-primary flex items-center gap-2 border-b pb-2">
                                    Fire News
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {displayedNews.map((news, idx) => (
                                        <Card key={idx} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm rounded-2xl md:rounded-[2rem]">
                                            <div className="relative h-40 md:h-48 overflow-hidden">
                                                <img
                                                    src={news.image}
                                                    alt={news.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                                                    <Badge variant="secondary" className="bg-primary/90 text-white border-none shadow-md text-[10px] md:text-xs">
                                                        {news.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 md:p-5">
                                                <div className="flex items-center text-xs text-muted-foreground mb-2">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {news.date}
                                                </div>
                                                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {news.title}
                                                </h4>
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                    {news.description}
                                                </p>
                                                <Link href={`/blogs/${idx}`}>
                                                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn font-semibold">
                                                        Read More <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                {fireNews.length > 4 && (
                                    <div className="flex justify-center mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowMoreNews(!showMoreNews)}
                                            className="px-8 border-primary/40 hover:bg-primary/5 hover:border-primary text-primary font-bold transition-all"
                                        >
                                            {showMoreNews ? "Show Less" : "Uncover More"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* UPCOMING VOUCHER OFFER (Right Part - 1/3) */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-racing-red border-b pb-2">
                                    Upcoming Voucher Offer
                                </h3>
                                <Card className="bg-gradient-to-br from-racing-red/10 to-primary/10 border-racing-red/20 overflow-hidden shadow-2xl relative">
                                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-racing-red/10 rounded-full blur-2xl"></div>
                                    <CardHeader className="text-center p-6 pb-2">
                                        <div className="mx-auto bg-racing-red text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center mb-3 shadow-lg animate-bounce">
                                            <Gift className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-xl md:text-2xl">Exclusive 20% Off</CardTitle>
                                        <CardDescription className="text-racing-red font-bold text-xs md:text-sm">Flipkart Fashion Sale</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center space-y-4 px-6">
                                        <p className="text-sm text-balance">
                                            Get ready for the biggest fashion sale of the season. Early access starts soon!
                                        </p>
                                        <div className="bg-background/80 backdrop-blur-md rounded-lg p-4 border border-dashed border-racing-red">
                                            <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Coupon Code</span>
                                            <span className="text-2xl font-display font-bold tracking-tighter">SOON20</span>
                                        </div>
                                        <Button className="w-full bg-racing-red hover:bg-racing-red/90 text-white font-bold py-6">
                                            Remind Me
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* UPCOMING UPDATES */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 mb-6 md:mb-8">
                                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                <h2 className="text-2xl md:text-3xl font-display font-bold">Upcoming Updates</h2>
                            </div>
                        </div>

                        {upcomingUpdates.length > 3 ? (
                            <div className="relative px-12">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent className="-ml-3 md:ml-4">
                                        {upcomingUpdates.map((update, idx) => (
                                            <CarouselItem key={idx} className="pl-3 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                                                <Card className="h-full border-l-4 border-l-primary bg-card/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl">
                                                    <CardContent className="p-4 md:p-6 flex items-start gap-3 md:gap-4">
                                                        <div className="p-2 md:p-3 bg-primary/10 rounded-lg md:rounded-xl shrink-0">
                                                            {update.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-base md:text-lg line-clamp-1">{update.title}</h4>
                                                            <p className="text-xs md:text-sm text-muted-foreground">{update.date}</p>
                                                            <Badge variant="outline" className="mt-1.5 md:mt-2 text-[9px] md:text-[10px] uppercase border-primary/20 bg-primary/5">
                                                                {update.status}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <div className="flex justify-end gap-2 mt-4 md:mt-0">
                                        <CarouselPrevious className="static md:absolute -left-12 translate-y-0 md:-translate-y-1/2 h-9 w-9 md:h-10 md:w-10 border-primary/20 text-primary hover:bg-primary/10" />
                                        <CarouselNext className="static md:absolute -right-12 translate-y-0 md:-translate-y-1/2 h-9 w-9 md:h-10 md:w-10 border-primary/20 text-primary hover:bg-primary/10" />
                                    </div>
                                </Carousel>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {upcomingUpdates.map((update, idx) => (
                                    <Card key={idx} className="border-l-4 border-l-primary bg-card/30 backdrop-blur-sm shadow-md">
                                        <CardContent className="p-6 flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl">
                                                {update.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{update.title}</h4>
                                                <p className="text-sm text-muted-foreground">{update.date}</p>
                                                <Badge variant="outline" className="mt-2 text-[10px] uppercase border-primary/20 bg-primary/5">
                                                    {update.status}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CHANGELOGS */}
                    <section className="bg-muted/30 rounded-3xl p-8 border">
                        <div className="flex items-center gap-2 mb-8">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                            <h2 className="text-3xl font-display font-bold">Site Changelogs</h2>
                        </div>
                        <div className="space-y-8">
                            {changelogs.map((log, idx) => (
                                <div key={idx} className="relative pl-8 border-l-2 border-muted">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <Badge variant="outline" className="font-mono">{log.version}</Badge>
                                        <span className="text-sm text-muted-foreground">{log.date}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {log.changes.map((change, cIdx) => (
                                            <li key={cIdx} className="flex items-center gap-2 text-sm md:text-base">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {config.footer.enabled && <Footer />}
            <MobileBottomNav />
        </div>
    );
}
