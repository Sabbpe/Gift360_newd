import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useConfig } from "@/contexts/ConfigContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Search, HelpCircle, ShoppingCart, CreditCard, ShieldCheck, Zap, MessageSquare, ArrowRight, User, Mail, MessageCircle } from "lucide-react";

const faqCategories = [
    { id: "general", label: "General", icon: HelpCircle, color: "bg-blue-500" },
    { id: "orders", label: "Orders & Payments", icon: ShoppingCart, color: "bg-green-500" },
    { id: "vouchers", label: "Vouchers & Brands", icon: CreditCard, color: "bg-purple-500" },
    { id: "security", label: "Security & Trust", icon: ShieldCheck, color: "bg-orange-500" },
    { id: "tech", label: "Technical Support", icon: Zap, color: "bg-yellow-500" },
    { id: "support", label: "Customer Care", icon: MessageSquare, color: "bg-racing-red" },
];

const faqData = {
    general: [
        { q: "What is Gift360?", a: "Gift360 is India's leading digital gifting platform where you can buy, send, and manage gift vouchers from over 200+ top brands instantly." },
        { q: "How do I create an account?", a: "To create an account, click on the 'Sign In' button at the top right, select 'Register', and enter your mobile number or email address to get started." },
        { q: "Is there a mobile app available?", a: "Yes, Gift360 is available on both iOS and Android. You can download it from the App Store or Google Play Store for a seamless gifting experience." },
        { q: "Can I use Gift360 without a mobile app?", a: "Yes, our website is fully responsive and offers all the features of the mobile app. You can access it from any browser on your phone or desktop." },
        { q: "How do I update my profile details?", a: "Go to 'My Profile' section after logging in. You can update your name, email, and preferred notification settings there." },
        { q: "What should I do if I forgot my password?", a: "Click on the 'Forgot Password' link on the sign-in page. We will send an OTP to your registered mobile/email to help you reset it." },
        { q: "Are there any membership fees for Gift360?", a: "No, joining Gift360 is completely free. You only pay for the gift vouchers you purchase." },
        { q: "Can I use multiple vouchers in a single brand purchase?", a: "This depends on the brand's policy. Most brands allow only one voucher per transaction, while some allow multiple. Please check the brand-specific terms." },
        { q: "How do I contact customer support?", a: "You can reach us via the 'Support' category on this FAQ page, drop a query using the button on the right, or email us at support@gift360.io." },
        { q: "Is Gift360 available in multiple languages?", a: "Currently, we support English and Hindi. We are working on adding more regional languages soon." },
        { q: "What are the benefits of the Gift360 Referral Program?", a: "Our Referral Program allows you to earn wallet credits for every friend you bring to the platform. Credits can be used to buy your favorite vouchers at a discount." },
    ],
    orders: [
        { q: "How can I pay for my vouchers?", a: "We support all major payment methods including UPI, Credit/Debit Cards, Net Banking, and various digital wallets like Paytm and PhonePe." },
        { q: "How long does it take to receives my voucher?", a: "Digital vouchers are delivered instantly to your registered email and mobile number via SMS as soon as the payment is confirmed." },
        { q: "Can I get a refund for a purchased voucher?", a: "Due to the nature of digital products, vouchers are generally non-refundable once issued. However, if there's a technical issue, our support team will assist you." },
        { q: "Are there any seasonal discounts on vouchers?", a: "Yes, we run mega sales during festivals and special events. Keep an eye on our 'Offers' section or subscribe to our newsletter for exclusive deals." },
    ],
    vouchers: [
        { q: "How do I redeem my gift voucher?", a: "Each brand has its own redemption process. Generally, you can use the voucher code at the brand's physical store or on their official website/app during checkout." },
        { q: "What is the validity of the vouchers?", a: "Validity varies by brand, usually ranging from 3 to 12 months. You can check the exact expiry date in your 'My Vouchers' section." },
        { q: "Can I send a voucher to someone else?", a: "Absolutely! During the purchase process, you can select 'Gift this item', enter the recipient's details, and we'll deliver it directly to them." },
        { q: "Can I use Gift360 vouchers for international brands?", a: "Currently, we offer vouchers for over 200+ top Indian brands. We are in the process of adding international brands to our catalog very soon." },
    ],
    security: [
        { q: "Is my payment information safe?", a: "Yes, we use industry-standard SSL encryption and PCI-DSS compliant payment gateways to ensure your financial data is 100% secure." },
        { q: "What should I do if I suspect a fraudulent transaction?", a: "Immediately contact our support team at support@gift360.io and notify your bank. We take security very seriously and will investigate immediately." },
    ],
    tech: [
        { q: "I didn't receive the OTP, what should I do?", a: "Please wait for 60 seconds and try 'Resend OTP'. Ensure you have a stable network connection. If the issue persists, try using an alternative login method." },
        { q: "The website is slow on my browser.", a: "We recommend using the latest version of Chrome, Safari, or Firefox. Clearing your browser cache can also help improve performance." },
        { q: "What should I do if the website crashes during payment?", a: "Don't worry. If your money is debited, it will be refunded automatically within 5-7 business days. You can also contact our support team with your transaction ID." },
    ],
    support: [
        { q: "How do I track my order status?", a: "You can track your order in the 'My Orders' section of your profile. We also send real-time updates via SMS and Email." },
        { q: "Can I cancel my voucher order?", a: "Orders for digital vouchers cannot be cancelled once the code has been generated and delivered." },
        { q: "What if my voucher is showing as 'Already Used'?", a: "Please contact our support team immediately with the voucher details and the brand's store location or website where you tried to redeem it." },
        { q: "Are there any hidden charges?", a: "No, the price you see on the brand page is inclusive of all taxes. There are no hidden processing fees." },
        { q: "How do I change my registered mobile number?", a: "For security reasons, you need to contact our support team to verify your identity before changing your registered mobile number." },
    ]
};

export default function FAQPage() {
    const { config } = useConfig();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("general");
    const [showQueryDialog, setShowQueryDialog] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        const results: { q: string, a: string, category: string }[] = [];

        Object.entries(faqData).forEach(([category, items]) => {
            items.forEach(item => {
                if (item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)) {
                    results.push({ ...item, category });
                }
            });
        });
        return results;
    }, [searchQuery]);

    useEffect(() => {
        setVisibleCount(10);
    }, [activeCategory]);

    useEffect(() => {
        document.title = "Help & FAQ | Gift360 - Your Gifting Partner";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Find answers to all your questions about Gift360 gift vouchers, payments, security, and more.");
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {config.header.enabled && <Header />}

            <main className="flex-1 pb-20">
                {/* HERO SECTION */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Help Center</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8 tracking-tight"
                        >
                            How can we <span className="text-primary italic">Help you</span> today?
                        </motion.h1>

                        {/* SEARCH BAR */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto relative group px-2 md:px-0"
                        >
                            <Search className="absolute left-7 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 md:w-5 md:h-5 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search questions..."
                                className="w-full h-12 md:h-16 pl-12 md:pl-14 pr-12 rounded-xl md:rounded-2xl bg-card border-border/50 shadow-lg md:shadow-xl text-base md:text-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                                >
                                    <Zap className="w-4 h-4 rotate-45" />
                                    {/* Using Zap rotated as a close icon to avoid extra imports if X is missing, but I have MessageCircle, etc. Actually I have Zap. Let's use a standard X if I can find one or just a text button. Actually I have MessageCircle. I will just use text or a simple circle. */}
                                </button>
                            )}
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4">
                    {/* CATEGORY SLIDER */}
                    <section className="mb-16">
                        <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent className="-ml-4">
                                {faqCategories.map((cat) => (
                                    <CarouselItem key={cat.id} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5">
                                        <button
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full p-6 rounded-3xl transition-all duration-300 flex flex-col items-center gap-4 border ${activeCategory === cat.id
                                                ? "bg-primary text-white border-primary shadow-xl scale-105"
                                                : "bg-card/50 backdrop-blur-sm border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
                                                }`}
                                        >
                                            <div className={`p-3 rounded-2xl ${activeCategory === cat.id ? "bg-white/20" : cat.color + " bg-opacity-10"}`}>
                                                <cat.icon className={`w-8 h-8 ${activeCategory === cat.id ? "text-white" : "text-foreground"}`} />
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                                        </button>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="flex justify-end gap-2 mt-4 md:hidden">
                                <CarouselPrevious className="static translate-y-0" />
                                <CarouselNext className="static translate-y-0" />
                            </div>
                        </Carousel>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* FAQ ACCORDION */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {searchQuery.trim() ? (
                                    <motion.div
                                        key="search-results"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                                                Search Results
                                                <span className="text-sm font-normal text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                                    {searchResults.length} found
                                                </span>
                                            </h2>
                                        </div>

                                        {searchResults.length > 0 ? (
                                            <Accordion type="single" collapsible className="space-y-4">
                                                {searchResults.map((item, idx) => (
                                                    <AccordionItem
                                                        key={`search-${idx}`}
                                                        value={`search-${idx}`}
                                                        className="border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm px-4 md:px-6 overflow-hidden"
                                                    >
                                                        <AccordionTrigger className="hover:no-underline py-4 md:py-6 text-left font-bold text-base md:text-lg group">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                                                                    {item.category}
                                                                </span>
                                                                <span className="group-data-[state=open]:text-primary transition-colors">{item.q}</span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-muted-foreground pb-4 md:pb-6 leading-relaxed text-sm md:text-base">
                                                            {item.a}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        ) : (
                                            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                                                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Search className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">No results found</h3>
                                                <p className="text-muted-foreground">
                                                    We couldn't find any match for "{searchQuery}".<br />
                                                    Try checking for typos or searching for a different keyword.
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeCategory}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <Accordion type="single" collapsible className="space-y-4">
                                            {faqData[activeCategory as keyof typeof faqData].slice(0, visibleCount).map((item, idx) => (
                                                <AccordionItem
                                                    key={idx}
                                                    value={`item-${idx}`}
                                                    className="border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm px-4 md:px-6 overflow-hidden"
                                                >
                                                    <AccordionTrigger className="hover:no-underline py-4 md:py-6 text-left font-bold text-base md:text-lg group">
                                                        <span className="group-data-[state=open]:text-primary transition-colors">{item.q}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground pb-4 md:pb-6 leading-relaxed text-sm md:text-base">
                                                        {item.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>

                                        {faqData[activeCategory as keyof typeof faqData].length > visibleCount && (
                                            <div className="mt-8 flex justify-center">
                                                <Button
                                                    onClick={() => setVisibleCount(prev => prev + 10)}
                                                    variant="outline"
                                                    className="rounded-xl border-primary text-primary hover:bg-primary/5 px-8 h-12 font-bold transition-all"
                                                >
                                                    Solve More
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* SIDEBAR / QUERY CARD */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-8">
                                <Card className="p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-racing-red text-white border-none overflow-hidden relative shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                    <div className="relative z-10">
                                        <MessageSquare className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6" />
                                        <h3 className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4">Still have questions?</h3>
                                        <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                                            Can't find the answer you're looking for? Please chat with our friendly team.
                                        </p>
                                        <Button
                                            onClick={() => setShowQueryDialog(true)}
                                            className="w-full bg-white text-racing-red hover:bg-white/90 rounded-xl md:rounded-2xl h-12 md:h-14 font-bold text-base md:text-lg group"
                                        >
                                            Drop a Query <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-card border-border/50 shadow-xl">
                                    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Popular Topics</h3>
                                    <div className="space-y-2 md:space-y-3">
                                        {[
                                            { label: "Refund Policy", href: "/refund" },
                                            { label: "Brand Validity", href: "/brand-validity" },
                                            { label: "Bulk Purchase", href: "/bulk-purchase" },
                                            { label: "Login Issues", href: "/login-issues" }
                                        ].map((topic, i) => (
                                            <Link key={i} href={topic.href}>
                                                <button className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-primary/5 transition-colors group">
                                                    <span className="font-semibold text-sm md:text-base text-muted-foreground group-hover:text-primary transition-colors">{topic.label}</span>
                                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QUERY DIALOG */}
                <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
                    <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                        <div className="bg-primary p-8 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-display font-bold">Drop a Query</DialogTitle>
                                <DialogDescription className="text-white/80 text-base">
                                    Have a specific question? Send us a message and we'll get back to you as soon as possible.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-8 bg-background">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowQueryDialog(false); }}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" /> Full Name
                                    </label>
                                    <Input placeholder="Enter your full name" className="h-12 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" /> Email Address
                                    </label>
                                    <Input type="email" placeholder="Enter your email" className="h-12 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-primary" /> Your Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us what you need help with..."
                                        className="w-full bg-muted/50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>

            {config.footer.enabled && <Footer />}
            <MobileBottomNav />
        </div>
    );
}
