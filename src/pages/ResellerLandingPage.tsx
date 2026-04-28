// pages/ResellerLandingPage.tsx
// Standalone reseller landing page with wallet-based registration flow
import { useState } from 'react';
import { useLocation } from 'wouter';
import StepCircle from '@/components/StepCircle';
import ResellerContactModal from '@/components/ResellerContactModal';
import { Wallet, Zap, LogIn, Tag, ShoppingCart, TrendingUp, UserPlus, Mail, Home, ArrowLeft } from "lucide-react";

export default function ResellerLandingPage() {
    const [, setLocation] = useLocation();
    const [showContactModal, setShowContactModal] = useState(false);

    // Highlight chips data for resellers
    const highlights = [
        { icon: TrendingUp, text: "Higher Margins", color: "bg-purple-100 text-purple-700" },
        { icon: Wallet, text: "Flexible Pricing", color: "bg-indigo-100 text-indigo-700" },
        { icon: Zap, text: "Fast Processing", color: "bg-pink-100 text-pink-700" }
    ];

    // Instruction steps - 6-step reseller flow
    const steps = [
        {
            id: 1,
            title: "Register as Reseller",
            description: "Register your organization to access reseller pricing and create your account.",
            icon: <UserPlus className="h-5 w-5 text-purple-600" />,
            onClick: () => setShowContactModal(true),
            actionText: "Click here to proceed"
        },
        {
            id: 2,
            title: "Login & Access Dashboard",
            description: "Login to your reseller dashboard to manage inventory and orders.",
            icon: <LogIn className="h-5 w-5 text-indigo-600" />
        },
        {
            id: 3,
            title: "Select Vouchers & Denominations",
            description: "Choose brand vouchers and pick resale-friendly denomination values.",
            icon: <Tag className="h-5 w-5 text-blue-600" />
        },
        {
            id: 4,
            title: "Add to Cart & Fund Wallet",
            description: "Review your inventory selection and top up your SabbPe wallet.",
            icon: <ShoppingCart className="h-5 w-5 text-purple-600" />
        },
        {
            id: 5,
            title: "Receive Vouchers",
            description: "Instantly access vouchers in your dashboard after wallet funding.",
            icon: <Mail className="h-5 w-5 text-blue-600" />
        },
        {
            id: 6,
            title: "Start Selling",
            description: "Begin reselling vouchers on your platform and earn margins.",
            icon: <TrendingUp className="h-5 w-5 text-orange-600" />
        }
    ];

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
                {/* RESELLER HERO BANNER */}
                <section className="relative overflow-hidden px-4 py-12 md:py-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Banner Card with Two Columns */}
                        <div className="bg-white/80 md:bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-10 lg:p-12 border border-white/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                
                                {/* LEFT SIDE - Text Content */}
                                <div className="space-y-5 md:space-y-6 order-2 md:order-1">
                                    {/* Reseller Mode Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-semibold shadow-md">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Reseller Mode</span>
                                    </div>
                                    
                                    {/* Title */}
                                    <h1 className="text-3xl md:text-5xl leading-[1.2] font-bold text-gray-900">
                                        Grow with us as a{" "}
                                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                            SabbPe Reseller Partner
                                        </span>
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-gray-600 leading-relaxed">
                                        pricing and scale your business seamlessly
                                    </p>

                                    {/* CTA Button */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setShowContactModal(true)}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition-all text-white font-semibold rounded-xl shadow-lg"
                                        >
                                            Get Started as Reseller
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
                                            Need reseller pricing support?{" "}
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
                                            src="/RESELLERIMAGE (2).png"
                                            alt="Reseller Partnership"
                                            className="w-full h-auto object-contain rounded-3xl shadow-xl"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        {/* Instruction Steps */}
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
            
            {/* Reseller Contact Modal */}
            <ResellerContactModal 
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
            />
        </div>
    );
}
