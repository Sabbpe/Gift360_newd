import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Prize configuration
const prizes = [
  { id: 1, amount: 10, label: '₹10', color: '#FF0080', probability: 5 },
  { id: 2, amount: 1, label: '₹1', color: '#9333EA', probability: 30 },
  { id: 3, amount: 5, label: '₹5', color: '#06B6D4', probability: 15 },
  { id: 4, amount: 2, label: '₹2', color: '#10B981', probability: 25 },
  { id: 5, amount: 3, label: '₹3', color: '#F59E0B', probability: 15 },
  { id: 6, amount: 1, label: '₹1', color: '#A855F7', probability: 10 },
];

export default function SpinWheel2D() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [userPoints, setUserPoints] = useState(150);
  const [spinsToday, setSpinsToday] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);

  const canSpin = spinsToday < 1 && userPoints >= 10 && !spinning;

  const selectPrize = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    return prizes[0];
  };

  const handleSpin = () => {
    if (!canSpin) return;

    setSpinning(true);
    const selectedPrize = selectPrize();
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const segmentAngle = 360 / prizes.length;
    const prizeAngle = prizeIndex * segmentAngle;
    
    const extraSpins = 5 * 360;
    const finalRotation = rotation + extraSpins + (360 - prizeAngle) + (segmentAngle / 2);
    
    setRotation(finalRotation);
    setWonPrize(selectedPrize);

    setTimeout(() => {
      setSpinning(false);
      setUserPoints(prev => prev - 10);
      setSpinsToday(1);
      setTotalWinnings(prev => prev + selectedPrize.amount);
      setShowResult(true);
    }, 6000);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-4 px-4">
        {[
          { label: 'Points', value: userPoints, icon: '⚡', color: 'from-yellow-500 to-orange-500' },
          { label: 'Spins', value: `${spinsToday}/1`, icon: '🎯', color: 'from-pink-500 to-purple-500' },
          { label: 'Won', value: `₹${totalWinnings}`, icon: '💰', color: 'from-green-500 to-teal-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/20`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Wheel Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-20">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[50px] border-t-yellow-400"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(255, 255, 0, 0.8))',
            }}
          />
        </div>

        {/* Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,128,0.6) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%) scale(1.5)',
            top: '50%',
            left: '50%',
          }}
        />

        {/* Wheel */}
        <div className="relative">
          <motion.div
            className="w-[500px] h-[500px] rounded-full relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              boxShadow: '0 0 0 15px rgba(255,255,255,0.1), 0 0 0 20px rgba(255,0,128,0.3), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Segments */}
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(50% 50%, 50% 0%, 93.3% 25%)',
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${prize.color}, ${prize.color}dd)`,
                    }}
                  >
                    <div
                      className="absolute top-[15%] left-1/2 -translate-x-1/2 text-4xl font-black text-white"
                      style={{
                        transform: 'translateX(-50%) rotate(30deg)',
                        textShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,0,0.5)',
                      }}
                    >
                      {prize.label}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-yellow-400">
              SPIN
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={handleSpin}
        disabled={!canSpin}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 px-12 py-6 text-3xl font-black uppercase tracking-widest rounded-full ${
          canSpin
            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white cursor-pointer shadow-2xl'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
        } transition-all`}
        whileHover={canSpin ? { scale: 1.1 } : {}}
        whileTap={canSpin ? { scale: 0.95 } : {}}
      >
        {spinning ? '🌪️ SPINNING...' : canSpin ? '🎰 SPIN NOW' : spinsToday >= 1 ? '⏰ TOMORROW' : '💸 NEED POINTS'}
      </motion.button>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && wonPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-2xl rounded-3xl p-12 max-w-2xl border-4 border-yellow-400 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-9xl text-center mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-6xl font-black text-yellow-400 text-center mb-4 uppercase tracking-wider">
                JACKPOT!
              </h2>
              <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-center mb-6">
                {wonPrize.label}
              </div>
              <p className="text-white/80 text-center text-xl mb-8">
                🎁 Voucher saved to your account!
              </p>
              <motion.button
                onClick={() => setShowResult(false)}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-2xl font-black py-4 rounded-full uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CLAIM NOW 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 left-8 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 uppercase tracking-wider">
          Gift360
        </h1>
        <p className="text-yellow-400 text-lg md:text-xl tracking-widest uppercase mt-2">Spin & Win!</p>
      </motion.div>
    </div>
  );
}
