// pages/CorporateLandingPage.tsx
// Standalone corporate landing page for employee rewards registration
import { useState } from 'react';
import { useLocation } from 'wouter';
import StepCircle from '@/components/StepCircle';
import CorporateContactModal from '@/components/CorporateContactModal';
import { Award, Gift, Shield, UserPlus, Upload, CheckSquare, CreditCard, ShoppingCart, Mail, Home, ArrowLeft } from "lucide-react";

export default function CorporateLandingPage() {
    const [, setLocation] = useLocation();
    const [showContactModal, setShowContactModal] = useState(false);

    // Highlight chips data for corporate rewards
    const highlights = [
        { icon: Award, text: "Employee Recognition", color: "bg-purple-100 text-purple-700" },
        { icon: Gift, text: "Bulk Allocation", color: "bg-indigo-100 text-indigo-700" },
        { icon: Shield, text: "Secure & Compliant", color: "bg-pink-100 text-pink-700" }
    ];

    // Corporate workflow steps - 6-step refined process with status tracking
    const [steps, setSteps] = useState([
        {
            id: 1,
            title: "Get Registered with SabbPe",
            description: "Register your organization to begin corporate rewards onboarding. Click \"Proceed\" to submit your details, followed by a handshake call and KYC verification.",
            icon: <UserPlus className="h-5 w-5 text-purple-600" />,
            status: 'completed' as const,
            onClick: () => setShowContactModal(true),
            actionText: "Click here to proceed"
        },
        {
            id: 2,
            title: "Upload Voucher Requirements (Excel)",
            description: "Upload an Excel sheet with your voucher requirements, including brands, denominations, and quantities.",
            icon: <Upload className="h-5 w-5 text-indigo-600" />,
            status: 'pending' as const
        },
        {
            id: 3,
            title: "Confirm Denominations & Allocation",
            description: "Review and confirm the denomination distribution and employee allocation details.",
            icon: <CheckSquare className="h-5 w-5 text-blue-600" />,
            status: 'pending' as const
        },
        {
            id: 4,
            title: "Complete Payment",
            description: "Process secure payment to confirm your corporate voucher order.",
            icon: <CreditCard className="h-5 w-5 text-green-600" />,
            status: 'pending' as const
        },
        {
            id: 5,
            title: "Voucher Procurement by SabbPe",
            description: "SabbPe procures your requested vouchers from partner brands and prepares allocation.",
            icon: <ShoppingCart className="h-5 w-5 text-orange-600" />,
            status: 'pending' as const
        },
        {
            id: 6,
            title: "Voucher Delivery to Corporate Email/Dashboard",
            description: "Receive vouchers directly to your corporate dashboard and designated email addresses.",
            icon: <Mail className="h-5 w-5 text-purple-600" />,
            status: 'pending' as const
        }
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-[#efe7ff] to-[#e4d7ff] relative overflow-hidden">
            {/* Decorative glow layers */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-300/30 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300/20 blur-[160px] rounded-full pointer-events-none" />
            
            {/* Navigation Bar */}
            <nav className="relative z-20 px-4 py-4 md:py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>
                    <button
                        onClick={() => setLocation('/')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all text-white font-medium"
                    >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </button>
                </div>
            </nav>
            
            <main className="relative w-full z-10">
                {/* CORPORATE HERO BANNER */}
                <section className="relative overflow-hidden px-4 py-12 md:py-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Banner Card with Two Columns */}
                        <div className="bg-white/80 md:bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-10 lg:p-12 border border-white/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                
                                {/* LEFT SIDE - Text Content */}
                                <div className="space-y-5 md:space-y-6 order-2 md:order-1">
                                    {/* Corporate Mode Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-semibold shadow-md">
                                        <Award className="h-4 w-4" />
                                        <span>Corporate Mode</span>
                                    </div>
                                    
                                    {/* Title */}
                                    <h1 className="text-3xl md:text-5xl leading-[1.2] font-bold text-gray-900">
                                        Reward your employees with{" "}
                                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                            SabbPe Corporate
                                        </span>
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-gray-600 leading-relaxed">
                                        Bulk voucher procurement, secure onboarding,<br className="hidden sm:block" />
                                        and seamless employee distribution
                                    </p>

                                    {/* CTA Button */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setShowContactModal(true)}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition-all text-white font-semibold rounded-xl shadow-lg"
                                        >
                                            <UserPlus className="h-5 w-5" />
                                            Get Registered with SabbPe
                                        </button>
                                    </div>

                                    {/* Feature Highlight Chips */}
                                    <div className="flex flex-wrap gap-3 pt-3">
                                        {highlights.map((highlight, index) => {
                                            const Icon = highlight.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${highlight.color} text-sm font-medium shadow-sm`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span>{highlight.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Helper Text */}
                                    <div className="pt-4">
                                        <p className="text-sm text-gray-600">
                                            Need assistance with corporate rewards?{" "}
                                            <a 
                                                href="mailto:contact@sabbpe.com" 
                                                className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
                                            >
                                                contact@sabbpe.com
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE - Illustration/Image */}
                                <div className="order-1 md:order-2 opacity-70 md:opacity-90 pt-4 md:pt-0">
                                    <div className="relative w-full max-w-xs md:max-w-md mx-auto">
                                        <img
                                            src="/corporateImage.png"
                                            alt="Corporate Rewards"
                                            className="w-full h-auto object-contain rounded-3xl shadow-xl"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        {/* How It Works Section */}
                        <div className="space-y-6 pt-10 md:pt-12">
                            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900">
                                HOW IT{" "}
                                <span className="relative inline-block text-purple-600">
                                    WORKS
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full"></span>
                                </span>
                            </h2>
                            <StepCircle steps={steps} />
                        </div>
                    </div>
                </section>
            </main>
            
            {/* Corporate Contact Modal */}
            <CorporateContactModal 
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
            />
        </div>
    );
}
