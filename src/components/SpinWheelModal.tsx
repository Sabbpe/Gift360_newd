// src/components/SpinWheelModal.tsx
// Highly optimized for mobile - wheel scales down properly
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SpinWheel } from './SpinWheel';
import { ResultDisplay } from './ResultDisplay';
import { Confetti } from './Confetti';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpinWheelModal({ isOpen, onClose }: SpinWheelModalProps) {
  const [result, setResult] = useState<string | null>(null);
  const [prizeValue, setPrizeValue] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [spinsToday, setSpinsToday] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  
  const MAX_SPINS_PER_DAY = 1;
  const canSpin = spinsToday < MAX_SPINS_PER_DAY;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowResult(false);
        setResult(null);
        setPrizeValue(null);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSpinComplete = async (spinResult: string, value: number) => {
    setResult(spinResult);
    setPrizeValue(value);
    setShowResult(true);
    setShowConfetti(true);
    
    setSpinsToday(prev => prev + 1);
    setTotalWinnings(prev => prev + value);
    
    setTimeout(() => setShowConfetti(false), 3500);
    
    try {
      const response = await fetch('/api/spin-wheel/save-result', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          prizeLabel: spinResult,
          prizeValue: value,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Spin result saved:', data);
      }
    } catch (error) {
      console.error('Failed to save spin result:', error);
    }
  };

  const handleClaimVoucher = () => {
    alert(`${result} voucher added to your account!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - MOBILE: Smaller max-width, better fit */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl max-h-[98vh] overflow-y-auto bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 rounded-xl shadow-2xl border border-amber-200/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-2 rounded-full bg-stone-800/80 hover:bg-stone-900 text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content - MOBILE: Compact padding */}
        <div className="p-3 sm:p-4 md:p-6">
          {/* Header - MOBILE: Smaller text */}
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-1 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-transparent">
              Spin & Win
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Try your luck and win exciting vouchers
            </p>
          </div>

          {/* Stats Bar - MOBILE: Compact */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 max-w-md mx-auto">
            <div className="bg-white/60 rounded-lg p-2 sm:p-3 border border-amber-200/50 text-center">
              <div className="text-[10px] sm:text-xs text-stone-500 mb-0.5 font-light uppercase tracking-wider">Today's Spins</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">{spinsToday}/{MAX_SPINS_PER_DAY}</div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-2 sm:p-3 border border-amber-200/50 text-center">
              <div className="text-[10px] sm:text-xs text-stone-500 mb-0.5 font-light uppercase tracking-wider">Total Won</div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">₹{totalWinnings}</div>
            </div>
          </div>

          {/* Daily Spin Info - MOBILE: Compact */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-block bg-amber-100/60 border border-amber-300/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                🎁 <span className="font-serif">1 Free Spin Daily</span>
              </p>
              {!canSpin && (
                <p className="text-amber-700 text-[10px] sm:text-xs mt-0.5 font-light">
                  Come back tomorrow
                </p>
              )}
            </div>
          </div>

          {/* The Spin Wheel - MOBILE: Constrained size */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] mx-auto">
              <SpinWheel 
                onSpinComplete={handleSpinComplete}
                disabled={!canSpin}
              />
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="w-full">
                <ResultDisplay 
                  result={result} 
                  value={prizeValue}
                  isVisible={showResult} 
                />
              </div>
            )}

            {/* Confetti Effect */}
            <Confetti isActive={showConfetti} />
          </div>

          {/* Action Buttons - MOBILE: Compact */}
          {showResult && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
              <button
                onClick={handleClaimVoucher}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium text-sm hover:from-amber-700 hover:to-amber-800 transition-all shadow-md"
              >
                Claim Voucher
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-300 transition-all shadow-md"
              >
                Close
              </button>
            </div>
          )}

          {/* How It Works - MOBILE: Compact */}
          <div className="bg-white/40 border border-amber-200/40 rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-800 mb-2 sm:mb-3 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl mb-1">🛍️</div>
                <p className="text-[10px] sm:text-xs text-stone-700 font-medium mb-0.5">Shop</p>
                <p className="text-[9px] sm:text-[10px] text-stone-500 font-light leading-tight hidden sm:block">
                  Browse vouchers
                </p>
              </div>
              <div>
                <div className="text-xl sm:text-2xl mb-1">🎯</div>
                <p className="text-[10px] sm:text-xs text-stone-700 font-medium mb-0.5">Spin</p>
                <p className="text-[9px] sm:text-[10px] text-stone-500 font-light leading-tight hidden sm:block">
                  Once daily
                </p>
              </div>
              <div>
                <div className="text-xl sm:text-2xl mb-1">🎁</div>
                <p className="text-[10px] sm:text-xs text-stone-700 font-medium mb-0.5">Win</p>
                <p className="text-[9px] sm:text-[10px] text-stone-500 font-light leading-tight hidden sm:block">
                  ₹1 to ₹10
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
