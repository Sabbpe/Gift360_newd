import { Zap, Gift, Users, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import SpinWheelModal from "@/components/SpinWheelModal";

// Import images
import hotdealsImg from "@/attached_assets/generated_images/Hotdeals.png";
import earlybirdImg from "@/attached_assets/generated_images/Earlybird.png";
import referralbonusImg from "@/attached_assets/generated_images/Referralbonus.png";
import freespinImg from "@/attached_assets/generated_images/Freespin.png";

interface DealCard {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  bgGradient: string;
  badge?: string;
  route?: string;
  action?: () => void;
}

export default function HotDealsSection() {
  const [, setLocation] = useLocation();
  const [showSpinWheel, setShowSpinWheel] = useState(false);

    const scrollToTopBrands = () => {
    const element = document.getElementById('top-brands-section');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const deals: DealCard[] = [
    {
      id: "hot-deals",
      title: "Hot Deals",
      description: "Exclusive offers you can't miss",
      image: hotdealsImg,
      icon: <Zap className="h-5 w-5" />,
      bgGradient: "from-orange-500/10 via-red-500/10 to-pink-500/10",
      badge: "Limited Time",
      action: scrollToTopBrands,
      // route: "/offers",
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Special discounts for early shoppers",
      image: earlybirdImg,
      icon: <Sparkles className="h-5 w-5" />,
      bgGradient: "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
      badge: "New",
      route: "/brands",
      // route: "/offers",
    },
    {
      id: "referral-bonus",
      title: "Referral Bonus",
      description: "Earn rewards by inviting friends",
      image: referralbonusImg,
      icon: <Users className="h-5 w-5" />,
      bgGradient: "from-purple-500/10 via-violet-500/10 to-indigo-500/10",
      badge: "Locked",
      // route: "/offers",
    },
    {
      id: "free-spin",
      title: "Free Spin",
      description: "Win exciting vouchers daily",
      image: freespinImg,
      icon: <Gift className="h-5 w-5" />,
      bgGradient: "from-green-500/10 via-emerald-500/10 to-lime-500/10",
      badge: "Daily",
      action: () => setShowSpinWheel(true),
    },
  ];

  const handleDealClick = (deal: DealCard) => {
    if (deal.action) {
      deal.action();
    } else if (deal.route) {
      setLocation(deal.route);
    }
  };

  return (
    <>
      {/* FIXED: Responsive padding - mobile first! */}
      <section className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
        {/* Grid Layout - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className="group relative cursor-pointer"
              onClick={() => handleDealClick(deal)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Card Container */}
              <div
                className={`
                relative overflow-hidden rounded-2xl 
                bg-gradient-to-br ${deal.bgGradient}
                border border-border/50
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-2xl hover:border-primary/50
                h-full
              `}
              >
                {/* FIXED: Responsive badge positioning and sizing */}
                {deal.badge && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                    <span
                      className="
                      inline-flex items-center gap-1 
                      px-2 py-0.5 sm:px-3 sm:py-1 
                      bg-primary text-primary-foreground 
                      text-[10px] sm:text-xs font-semibold rounded-full
                      shadow-lg
                    "
                    >
                      <span className="hidden sm:inline">{deal.icon}</span>
                      {deal.badge}
                    </span>
                  </div>
                )}

                {/* FIXED: Responsive image height */}
                <div className="relative h-36 sm:h-40 lg:h-44 overflow-hidden bg-white/50 dark:bg-black/20">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="
      w-full h-full 
      object-cover object-center
      transition-transform duration-500 ease-out
      group-hover:scale-105
    "
                    style={{
                      objectPosition: 'center 30%'
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`
                      absolute inset-0 transition-opacity duration-300 group-hover:opacity-80
                      bg-gradient-to-t from-black/5 via-black/6 to-transparent
                      dark:from-white/5 dark:via-white/6 dark:to-transparent
                    `}
                  />
                </div>

                {/* FIXED: Responsive content padding and spacing */}
                <div className="p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="
                      p-1 sm:p-1.5 rounded-lg bg-primary/10 text-primary
                      group-hover:bg-primary group-hover:text-primary-foreground
                      transition-colors duration-300
                    "
                    >
                      {deal.icon}
                    </div>
                    {/* FIXED: Responsive title */}
                    <h3 className="text-sm sm:text-base font-bold">{deal.title}</h3>
                  </div>

                  {/* FIXED: Responsive description */}
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Hover Arrow */}
                  <div
                    className="
                    pt-0.5 sm:pt-1 flex items-center gap-1.5 sm:gap-2 
                    text-[11px] sm:text-xs font-medium text-primary
                    opacity-0 group-hover:opacity-100 
                    transform translate-x-0 group-hover:translate-x-2
                    transition-all duration-300
                  "
                  >
                    {deal.id === 'free-spin' ? 'Spin Now' : 'Explore'}
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* 🎰 Spin Wheel Modal */}
      <SpinWheelModal
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
      />
    </>
  );
}
