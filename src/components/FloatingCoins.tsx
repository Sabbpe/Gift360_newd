type Props = { count?: number; className?: string };

export const FloatingCoins = ({ count = 14, className = "" }: Props) => {
  const coins = Array.from({ length: count }).map((_, i) => {
    const left = Math.round((i / count) * 100 + (Math.random() * 8 - 4));
    const delay = (Math.random() * 8).toFixed(2);
    const size = 8 + Math.round(Math.random() * 10);
    const cx = `${Math.round(Math.random() * 80 - 40)}px`;
    const cx2 = `${Math.round(Math.random() * 80 - 40)}px`;
    const isCoin = i % 3 !== 0;
    return { left, delay, size, cx, cx2, isCoin, key: i };
  });
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {coins.map((c) => (
        <span
          key={c.key}
          className="absolute bottom-0 anim-coin-rise"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            ["--cx" as string]: c.cx,
            ["--cx2" as string]: c.cx2,
          }}
        >
          {c.isCoin ? (
            <span
              className="block rounded-full anim-coin-spin"
              style={{
                width: c.size,
                height: c.size,
                background:
                  "radial-gradient(circle at 35% 30%, hsl(48 100% 75%), hsl(40 95% 50%) 60%, hsl(30 80% 35%) 100%)",
                boxShadow: "0 0 14px hsla(45,95%,60%,0.55), inset 0 0 4px hsla(20,80%,30%,0.35)",
              }}
            />
          ) : (
            <span
              className="block rotate-45"
              style={{
                width: c.size * 0.9,
                height: c.size * 0.9,
                background: "linear-gradient(135deg, white, hsl(45 95% 70%))",
                clipPath: "polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)",
                filter: "drop-shadow(0 0 8px hsla(45,95%,65%,0.7))",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
};
