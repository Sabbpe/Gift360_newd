import { useLocation } from "wouter";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useConfig } from "@/contexts/ConfigContext";

export default function LoginIssues() {
    const [, setLocation] = useLocation();
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
                                <Zap className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold">Login & Access Issues</h1>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                            <section>
                                <p className="text-muted-foreground leading-relaxed">
                                    Having trouble logging in? Don't worry, we're here to help you get back to your vouchers quickly.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">1. Troubleshooting OTP Issues</h2>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Wait for at least 60 seconds before requesting a "Resend".</li>
                                    <li>Check if your mobile network is stable.</li>
                                    <li>Ensure you haven't blocked SMS from unknown senders in your phone settings.</li>
                                    <li>Verify that you entered the correct mobile number.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">2. "Account Locked" error</h2>
                                <p className="text-muted-foreground">
                                    As a security measure, accounts are temporarily locked after 5 failed login attempts. Please wait for <strong>30 minutes</strong> before trying again, or use the "Forgot Password" link to reset your access.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">3. Browser Compatibility</h2>
                                <p className="text-muted-foreground">
                                    Ensure you are using the latest version of your browser. We recommend <strong>Google Chrome</strong> or <strong>Safari</strong> for the best experience. Sometimes, clearing your browser cache/cookies can solve persistent login bugs.
                                </p>
                            </section>

                            <div className="pt-8 border-t border-border flex flex-wrap gap-4">
                                <Button variant="outline" onClick={() => setLocation("/forgot-password")} className="rounded-xl border-primary text-primary hover:bg-primary/5">
                                    Reset Password
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8">
                                    Contact Support
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
