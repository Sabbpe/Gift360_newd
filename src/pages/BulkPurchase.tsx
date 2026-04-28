import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useConfig } from "@/contexts/ConfigContext";

export default function BulkPurchase() {
    const { config } = useConfig();

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {config.header.enabled && <Header />}

            <main className="flex-1 pb-16">
                <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 sm:py-20">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="mb-8 group hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Button>

                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-12 shadow-xl">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <div className="p-2.5 md:p-3 rounded-2xl bg-primary/10 text-primary">
                                <ShoppingCart className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold">Bulk Purchase & Corporate Gifting</h1>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                            <section>
                                <p className="text-muted-foreground leading-relaxed">
                                    Whether you're looking to reward your employees or surprise your clients, SabbPe offers a robust platform for bulk gift voucher purchases with exclusive benefits.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">1. Benefits of Bulk Orders</h2>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Special corporate discounts on top brands.</li>
                                    <li>Dedicated account manager for seamless coordination.</li>
                                    <li>Customized branding options for your delivery messages.</li>
                                    <li>Bulk delivery via Excel/CSV uploads.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">2. How to place a bulk order?</h2>
                                <p className="text-muted-foreground">
                                    Currently, we handle bulk orders through our corporate sales team. You can initiate a request by clicking the <strong>"Drop a Query"</strong> button on the FAQ page and selecting "Bulk Purchase" as the topic.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">3. Delivery Timelines</h2>
                                <p className="text-muted-foreground">
                                    While individual orders are instant, bulk orders may take <strong>2-4 business hours</strong> for processing and security checks before deployment.
                                </p>
                            </section>

                            <div className="pt-8 border-t border-border text-center">
                                <h3 className="text-xl font-bold mb-4">Ready to power your rewards?</h3>
                                <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 h-12">
                                    Contact Sales Team
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {config.footer.enabled && <Footer />}
        </div>
    );
}
