import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useConfig } from "@/contexts/ConfigContext";

export default function BrandValidity() {
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
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold">Brand Validity & Expiry</h1>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                            <section>
                                <p className="text-muted-foreground leading-relaxed">
                                    Understanding the validity of your digital gift vouchers is crucial to ensure you get the full value of your purchase. Each brand sets its own rules regarding how long a voucher remains active.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">1. Where to check validity?</h2>
                                <p className="text-muted-foreground">
                                    You can find the expiry date for any voucher you've purchased in your <strong>"My Vouchers"</strong> section. We also include the expiry date in the delivery email and SMS sent to you.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">2. Typical Validity Periods</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <h3 className="font-bold text-primary mb-1">E-commerce Brands</h3>
                                        <p className="text-sm text-muted-foreground">Usually 6 to 12 months from the date of issuance.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <h3 className="font-bold text-primary mb-1">Food & Dining</h3>
                                        <p className="text-sm text-muted-foreground">Typically 3 to 6 months validity.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">3. Can I extend my voucher?</h2>
                                <p className="text-muted-foreground">
                                    No, once a voucher is issued, the expiry date is fixed by the brand and <strong>cannot be extended</strong> by Gift360. We recommend redeeming your vouchers as soon as possible to avoid any loss.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">4. What happens if it expires?</h2>
                                <p className="text-muted-foreground">
                                    Expired vouchers lose their value and are no longer redeemable. Gift360 is not liable for any balance remaining on an expired gift card.
                                </p>
                            </section>

                            <div className="pt-8 border-t border-border">
                                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                    <h3 className="font-bold mb-2">Pro Tip:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enable notifications in your Gift360 account settings. We send helpful reminders before your vouchers are set to expire!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {config.footer.enabled && <Footer />}
        </div>
    );
}
