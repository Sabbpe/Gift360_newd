import { createContext, useContext, useState, type ReactNode } from 'react';

interface GuideContextType {
  guideTarget: string | null;
  setGuideTarget: (target: string | null) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [guideTarget, setGuideTarget] = useState<string | null>(null);

  return (
    <GuideContext.Provider value={{ guideTarget, setGuideTarget }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  // Return default values if not within provider
  if (!context) {
    return {
      guideTarget: null,
      setGuideTarget: () => {}
    };
  }
  return context;
}
