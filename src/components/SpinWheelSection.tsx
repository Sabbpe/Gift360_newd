// components/SpinWheelSection.tsx
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the 3D component for better performance
// @ts-ignore - Epic3DSpinWheel is a .jsx file
const Epic3DSpinWheel = lazy(() => import('./Epic3DSpinWheel'));

interface SpinWheelSectionProps {
  fullScreen?: boolean; // If true, takes full viewport
  embedded?: boolean; // If true, shows in a card on home page
}

export default function SpinWheelSection({ 
  fullScreen = false, 
  embedded = false 
}: SpinWheelSectionProps) {
  
  if (fullScreen) {
    // Full screen mode - separate page
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Epic3DSpinWheel />
      </Suspense>
    );
  }

  if (embedded) {
    // Embedded mode - card on home page
    return (
      <section className="max-w-7xl mx-auto px-10 lg:px-8 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">🎰 Daily Spin & Win</h2>
            <p className="text-muted-foreground mt-2">
              Spin the wheel and win vouchers up to ₹10 daily!
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl"
        >
          {/* 3D Canvas Container */}
          <div className="h-[600px] relative">
            <Suspense fallback={<LoadingSpinner />}>
              <Epic3DSpinWheel />
            </Suspense>
          </div>

          {/* Call to Action Overlay (Optional) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-center">
            <p className="text-white text-lg mb-4">
              💎 Earn points by shopping • 🎯 1 free spin daily • 🎁 Win up to ₹10
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Default compact preview mode
  return (
    <section className="max-w-7xl mx-auto px-10 lg:px-8 md:px-10 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-yellow-400/50 shadow-2xl cursor-pointer group"
        onClick={() => window.location.href = '/spin-wheel'} // Navigate to full page
      >
        {/* Preview Image/Thumbnail */}
        <div className="h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-pink-600/50 backdrop-blur-xl" />
          
          {/* Animated preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 rounded-full border-8 border-yellow-400 shadow-2xl"
              style={{
                background: 'conic-gradient(from 0deg, #FF0080, #9333EA, #06B6D4, #10B981, #F59E0B, #A855F7, #FF0080)'
              }}
            />
          </div>

          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🎰
            </motion.div>
            <h3 className="text-5xl font-black text-white mb-2 drop-shadow-2xl">
              SPIN & WIN
            </h3>
            <p className="text-2xl text-yellow-400 font-bold">
              Up to ₹10 Daily!
            </p>
          </div>

          {/* "Click to Play" indicator */}
          <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider group-hover:scale-110 transition-transform shadow-xl">
            Click to Play →
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-black/40 backdrop-blur-md p-6 grid grid-cols-3 gap-4 text-center border-t border-white/10">
          <div>
            <div className="text-3xl font-bold text-yellow-400">1</div>
            <div className="text-sm text-white/70">Free Spin Daily</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">₹10</div>
            <div className="text-sm text-white/70">Max Prize</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">10</div>
            <div className="text-sm text-white/70">Points to Spin</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">🎰</span>
        </div>
      </div>
      <p className="ml-4 text-white text-xl font-bold">Loading 3D Wheel...</p>
    </div>
  );
}
