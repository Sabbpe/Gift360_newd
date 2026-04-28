// src/components/ResultDisplay.tsx
// Mobile responsive result display - Fixed unused variable warning

import { cn } from "@/lib/utils";
import { Gift, Sparkles } from "lucide-react";

interface ResultDisplayProps {
  result: string | null;
  value?: number | null;
  isVisible: boolean;
}

// Fixed: Prefix unused parameter with underscore to suppress TypeScript warning
export const ResultDisplay = ({ result, value: _value, isVisible }: ResultDisplayProps) => {
  if (!result || !isVisible) return null;

  return (
    <div
      className={cn(
        "result-card-racing rounded-xl p-6 sm:p-8 text-center w-full max-w-md mx-auto",
        "animate-bounce-in"
      )}
    >
      {/* Header with Icons - MOBILE: Smaller icons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-racing-red animate-pulse" />
        <p className="text-muted-foreground font-body text-xs sm:text-sm uppercase tracking-widest">
          🎉 Congratulations! 🎉
        </p>
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-racing-red animate-pulse" />
      </div>

      {/* Prize Amount - MOBILE: Responsive text size */}
      <div className="mb-3 sm:mb-4">
        <div className="text-5xl sm:text-6xl md:text-7xl font-display text-white mb-2 animate-pulse">
          {result}
        </div>
        <p className="text-lg sm:text-xl text-yellow-400 font-semibold">
          Gift Voucher Won!
        </p>
      </div>

      {/* Gift Icon - MOBILE: Smaller icon */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="bg-racing-red/20 p-3 sm:p-4 rounded-full">
          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-racing-red" />
        </div>
      </div>

      {/* Description - MOBILE: Smaller text */}
      <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
        Your {result} voucher has been saved to your account!
      </p>

      {/* Decorative Emojis - MOBILE: Smaller */}
      <div className="flex justify-center gap-1 sm:gap-2">
        {["🎁", "✨", "🎊", "✨", "🎁"].map((emoji, i) => (
          <span
            key={i}
            className="text-xl sm:text-2xl animate-float"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};
