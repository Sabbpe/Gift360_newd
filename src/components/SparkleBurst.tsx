import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

type Burst = { id: number; x: number; y: number };

let _id = 0;

export const useSparkleBurst = () => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const fire = (e?: { clientX: number; clientY: number }) => {
    const id = ++_id;
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    setBursts((b) => [...b, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((bb) => bb.id !== id)), 1000);
  };

  const overlay = (
    <div className="fixed inset-0 pointer-events-none z-[80]">
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * 360;
            const dist = 60 + Math.random() * 40;
            return (
              <div
                key={i}
                className="absolute anim-sparkle-fly"
                style={{
                  ["--sa" as string]: `${angle}deg`,
                  ["--sd" as string]: `${dist}px`,
                  animationDelay: `${i * 0.02}s`,
                }}
              >
                <Sparkles
                  className="w-3 h-3 drop-shadow"
                  style={{ color: i % 2 ? "hsl(45 95% 60%)" : "hsl(280 90% 65%)" }}
                  strokeWidth={2.6}
                />
              </div>
            );
          })}
          <span className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-300/40 anim-ring-ping" />
        </div>
      ))}
    </div>
  );

  return { fire, overlay };
};
