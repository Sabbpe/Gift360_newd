// config/features.ts
// Add this to your existing config structure

export interface SpinWheelConfig {
  enabled: boolean;
  mode: 'preview' | 'embedded' | 'separate-page';
  placement: 'after-hero' | 'after-hot-deals' | 'before-featured';
  dailySpinLimit: number;
  pointsCost: number;
  maxPrize: number;
  prizes: {
    amount: number;
    probability: number;
  }[];
}

// Add to your main config
export const spinWheelConfig: SpinWheelConfig = {
  enabled: true,
  mode: 'preview', // 'preview' | 'embedded' | 'separate-page'
  placement: 'after-hero', // Where to show on home page
  dailySpinLimit: 1,
  pointsCost: 10,
  maxPrize: 10,
  prizes: [
    { amount: 10, probability: 5 },
    { amount: 5, probability: 15 },
    { amount: 3, probability: 15 },
    { amount: 2, probability: 25 },
    { amount: 1, probability: 40 },
  ]
};
