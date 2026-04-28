/**
 * OnlineIndicator.tsx
 *
 * Drop this anywhere in your Header, ideally right next to the logo.
 *
 * Usage in Header.tsx:
 *   import OnlineIndicator from '@/components/OnlineIndicator';
 *   ...
 *   <div className="flex items-center gap-3">
 *     <Logo />
 *     <OnlineIndicator />
 *   </div>
 */

import { useEffect, useState } from "react";

interface OnlineIndicatorProps {
  compact?: boolean;
}

// Generates a random integer between min and max (inclusive)
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function OnlineIndicator({ compact = false }: OnlineIndicatorProps) {
  const [count, setCount] = useState(() => randomBetween(150, 500));

  useEffect(() => {
    // Drift the count naturally every 8-15 seconds
    const drift = () => {
      setCount((prev) => {
        const delta = randomBetween(-18, 22); // slight upward bias
        return Math.min(500, Math.max(150, prev + delta));
      });
    };

    const scheduleNext = () => {
      const delay = randomBetween(8000, 15000);
      return setTimeout(() => {
        drift();
        timer = scheduleNext();
      }, delay);
    };

    let timer = scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`inline-flex items-center ${compact ? "gap-1 px-1.5 py-0.5 rounded-md bg-transparent border border-emerald-200/70 dark:border-emerald-800/50" : "gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60"} select-none`}
    >
      {/* Pulsing green dot */}
      <span className={`relative flex ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
        <span className={`relative inline-flex rounded-full ${compact ? "h-1.5 w-1.5" : "h-2 w-2"} bg-emerald-500`} />
      </span>

      {/* Count + label */}
      <span
        className={`${compact ? "text-[10px] font-medium text-emerald-700/90 dark:text-emerald-400/90" : "text-[11px] font-semibold text-emerald-700 dark:text-emerald-400"} whitespace-nowrap`}
      >
        {count.toLocaleString("en-IN")} online
      </span>
    </div>
  );
}
