import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
};

export const CountUp = ({ to, duration = 1400, format, className, prefix, suffix }: Props) => {
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    start.current = null;
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      const elapsed = t - start.current;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [to, duration]);

  const formatted = format ? format(value) : value.toLocaleString("en-IN");
  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
