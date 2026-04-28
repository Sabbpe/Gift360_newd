import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export type GuideState =
  | "intro"
  | "budgetGuide"
  | "scrollHint"
  | "thinking"
  | "confirm"
  | "skipHint"
  | "complete"
  | "idle";

interface SabbieGuideProps {
  guideState: GuideState;
}

const dialogues: Record<GuideState, string> = {
  intro: "Welcome to SabbPe! I'm Sabbie, and I'm going to find you the best deals around.",
  budgetGuide: "Tell me your budget, and I'll filter out the noise for you!",
  scrollHint: "Swipe to see more categories →",
  thinking: "Hmm, let me think about that...",
  confirm: "Nice choice! I'm finding the best deals now.",
  skipHint: "You can skip this step anytime!",
  complete: "All set! Check out the 'Super Cashbacks' I found for you below.",
  idle: ""
};

const sabbieVariants = {
  intro: {
    y: [0, -12, 0],
    rotate: [0, 6, -6, 0],
    transition: {
      duration: 1.2,
      repeat: 2,
      ease: "easeInOut" as const
    }
  },
  budgetGuide: {
    rotate: [0, -12, 0],
    x: [0, -8, 0],
    transition: {
      duration: 0.8,
      repeat: 3,
      ease: "easeInOut" as const
    }
  },
  scrollHint: {
    x: [0, 20, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  thinking: {
    scale: [1, 1.06, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  confirm: {
    scale: [1, 1.15, 1],
    rotate: [0, 8, 0],
    transition: {
      duration: 0.6,
      repeat: 2,
      ease: "easeOut" as const
    }
  },
  skipHint: {
    y: [0, -6, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  },
  complete: {
    rotate: [0, 15, -15, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.8,
      repeat: 2
    }
  },
  idle: {
    y: [0, -3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

const positionVariants: Record<GuideState, any> = {
  intro: { top: "30%", left: "50%", x: "-50%", y: "-50%", right: "auto", bottom: "auto" },
  budgetGuide: { top: "auto", bottom: "22rem", right: "2rem", left: "auto", x: 0, y: 0 },
  scrollHint: { top: "40%", right: "2rem", left: "auto", bottom: "auto", x: 0, y: "-50%" },
  thinking: { top: "auto", bottom: "22rem", right: "2rem", left: "auto", x: 0, y: 0 },
  confirm: { top: "auto", bottom: "22rem", right: "2rem", left: "auto", x: 0, y: 0 },
  skipHint: { bottom: "10rem", right: "2rem", top: "auto", left: "auto", x: 0, y: 0 },
  complete: { bottom: "7rem", right: "2rem", top: "auto", left: "auto", x: 0, y: 0 },
  idle: { bottom: "7rem", right: "2rem", top: "auto", left: "auto", x: 0, y: 0 }
};

export function SabbieGuide({ guideState }: SabbieGuideProps) {
  const [showDialogue, setShowDialogue] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    setShowDialogue(true);
    const timer = setTimeout(() => setShowDialogue(false), 4000);
    return () => clearTimeout(timer);
  }, [guideState]);

  // Generate sparkles for skipHint state
  useEffect(() => {
    if (guideState === "skipHint") {
      const interval = setInterval(() => {
        setSparkles(prev => [
          ...prev.slice(-3),
          { id: Date.now(), x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }
        ]);
      }, 300);
      return () => clearInterval(interval);
    } else {
      setSparkles([]);
    }
  }, [guideState]);

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      initial={positionVariants.intro}
      animate={positionVariants[guideState]}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Sabbie Character */}
      <motion.div
        className="relative pointer-events-auto"
        variants={sabbieVariants}
        animate={guideState}
      >
        {/* Star-shaped character */}
        <div className="relative">
          {/* Main star body */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="drop-shadow-2xl filter"
          >
            <defs>
              <linearGradient id="sabbieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Star shape */}
            <path
              d="M50 10 L61 39 L92 39 L67 58 L78 87 L50 68 L22 87 L33 58 L8 39 L39 39 Z"
              fill="url(#sabbieGradient)"
              stroke="#ffffff"
              strokeWidth="3"
            />
          </svg>

          {/* Eyes */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 flex gap-4">
            <motion.div
              className="w-4 h-5 bg-white rounded-full"
              animate={{
                scaleY: guideState === "complete" ? [1, 0.3, 1] : 1
              }}
              transition={{ duration: 0.2, repeat: guideState === "complete" ? 1 : 0 }}
            >
              <div className="w-2 h-2 bg-gray-900 rounded-full ml-0.5 mt-0.5" />
            </motion.div>
            <motion.div
              className="w-4 h-5 bg-white rounded-full"
              animate={{
                scaleY: guideState === "complete" ? [1, 0.3, 1] : 1
              }}
              transition={{ duration: 0.2, repeat: guideState === "complete" ? 1 : 0, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-gray-900 rounded-full ml-0.5 mt-0.5" />
            </motion.div>
          </div>

          {/* Smile */}
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2">
            <svg width="24" height="14" viewBox="0 0 24 14">
              <path
                d="M2 2 Q12 12 22 2"
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Small hand for pointing */}
          {(guideState === "budgetGuide" || guideState === "skipHint") && (
            <motion.div
              className="absolute -right-4 top-1/2 -translate-y-1/2"
              animate={{
                x: guideState === "budgetGuide" ? [0, -10, 0] : [0, -6, 0],
                rotate: guideState === "budgetGuide" ? [-20, -30, -20] : [20, 30, 20]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-4xl">👉</div>
            </motion.div>
          )}

          {/* Thinking pose (hand to chin) */}
          {guideState === "thinking" && (
            <motion.div
              className="absolute -bottom-3 -left-3"
              animate={{
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-3xl">🤔</div>
            </motion.div>
          )}

          {/* Thumbs up */}
          {guideState === "confirm" && (
            <motion.div
              className="absolute -top-5 -right-5"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
            >
              <div className="text-4xl">👍</div>
            </motion.div>
          )}

          {/* Sparkles for skip hint */}
          {guideState === "skipHint" && sparkles.map(sparkle => (
            <motion.div
              key={sparkle.id}
              className="absolute text-yellow-400 text-xl"
              initial={{ scale: 0, x: sparkle.x, y: sparkle.y, opacity: 1 }}
              animate={{ 
                scale: [0, 1, 0],
                y: sparkle.y - 20,
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 1 }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showDialogue && dialogues[guideState] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 z-[9999]"
          >
            <div className="relative bg-white rounded-2xl px-4 py-3 shadow-2xl border-2 border-purple-200">
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                {dialogues[guideState]}
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-9 border-r-9 border-t-9 border-transparent border-t-purple-200" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
