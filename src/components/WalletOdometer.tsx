import { useEffect, useState } from "react";

// WalletOdometer.tsx
export function WalletOdometer({ value, duration = 2000 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start: number | null = null;
        const startValue = 0;
        const endValue = value;

        const step = (timestamp: number) => {
            if (start === null) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = Math.round(startValue + (endValue - startValue) * progress);
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(step);
        };

        setDisplayValue(0);
        requestAnimationFrame(step);
    }, [value, duration]);

    return (
        <div className="flex items-baseline justify-center gap-0.5">
            <span className="font-mono text-[11px] leading-none text-yellow-700 font-semibold">
                {displayValue.toLocaleString("en-IN")}
            </span>
            <span className="text-[9px] leading-none text-yellow-700 font-semibold">
                pts
            </span>
        </div>
    );

}

