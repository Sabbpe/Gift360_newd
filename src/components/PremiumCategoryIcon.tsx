import { motion } from 'framer-motion';
import {
  Gamepad2,
  Utensils,
  ShoppingBag,
  Shirt,
  Plane,
  Film,
  Sparkles,
  Gem,
  Dumbbell,
  type LucideIcon
} from 'lucide-react';
import { useGuide } from '@/contexts/GuideContext';

export type CategoryType = 
  | 'food' 
  | 'ecommerce' 
  | 'fashion' 
  | 'travel' 
  | 'gaming' 
  | 'wellness' 
  | 'jewellery' 
  | 'entertainment' 
  | 'sports';

interface PremiumCategoryIconProps {
  type: CategoryType;
  id?: string;
  isActive?: boolean;
  isHovered?: boolean;
  isGuided?: boolean; // Optional override
}

// Map category types to Lucide icons - clean line icons
const iconMap: Record<CategoryType, LucideIcon> = {
  food: Utensils,
  ecommerce: ShoppingBag,
  fashion: Shirt,
  travel: Plane,
  gaming: Gamepad2,
  wellness: Sparkles,
  jewellery: Gem,
  entertainment: Film,
  sports: Dumbbell
};

// Export helper function to get text color for category labels - unified purple
export function getCategoryTextColor(type: CategoryType): string {
  return 'text-purple-600';
}

export default function PremiumCategoryIcon({ 
  type,
  id,
  isActive = false, 
  isHovered = false,
  isGuided: isGuidedProp
}: PremiumCategoryIconProps) {
  const Icon = iconMap[type];
  const { guideTarget } = useGuide();
  
  // Use prop if provided, otherwise check context
  const isGuided = isGuidedProp !== undefined ? isGuidedProp : (id && guideTarget === id);

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        scale: isActive ? 1.02 : isHovered ? 1.01 : 1
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.2 }
      }}
    >
      {/* Shimmer effect for guided state */}
      {isGuided && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-purple-200/40 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Minimal Line Icon - SabbPe Purple */}
      <motion.div
        className="flex items-center justify-center"
        animate={
          isGuided
            ? { scale: [1, 1.06, 1] }
            : isHovered
            ? { scale: 1.04 }
            : { scale: 1 }
        }
        transition={{
          scale: {
            duration: isGuided ? 1.5 : 0.3,
            repeat: isGuided ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
      >
        <Icon 
          className={`w-7 h-7 transition-colors duration-300 ${
            isActive || isHovered 
              ? 'text-purple-700' 
              : 'text-purple-600'
          }`} 
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.div>
  );
}
