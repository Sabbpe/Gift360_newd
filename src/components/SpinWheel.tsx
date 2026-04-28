import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
  value: number;
}

const SEGMENTS: WheelSegment[] = [
  { label: "₹10", color: "#DC2626", textColor: "#fff", value: 10 },
  { label: "₹5", color: "#1a1a1a", textColor: "#fff", value: 5 },
  { label: "₹3", color: "#EAB308", textColor: "#000", value: 3 },
  { label: "₹2", color: "#1a1a1a", textColor: "#fff", value: 2 },
  { label: "₹1", color: "#DC2626", textColor: "#fff", value: 1 },
  { label: "Better Luck", color: "#1a1a1a", textColor: "#fff", value: 0 },
  { label: "₹8", color: "#EAB308", textColor: "#000", value: 8 },
  { label: "Free Spin", color: "#1a1a1a", textColor: "#fff", value: 0 },
];

interface SpinWheelProps {
  onSpinComplete: (result: string, value: number) => void;
  disabled?: boolean;
}

export const SpinWheel = ({ onSpinComplete, disabled = false }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spinWheel = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    
    const fullRotations = 5 + Math.random() * 5;
    const segmentAngle = 360 / SEGMENTS.length;
    const randomSegment = Math.floor(Math.random() * SEGMENTS.length);
    const finalAngle = fullRotations * 360 + randomSegment * segmentAngle + segmentAngle / 2;
    
    setRotation(prev => prev + finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = (rotation + finalAngle) % 360;
      const segmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % SEGMENTS.length;
      const wonSegment = SEGMENTS[segmentIndex];
      onSpinComplete(wonSegment.label, wonSegment.value);
    }, 4000);
  };

  const segmentAngle = 360 / SEGMENTS.length;
  const radius = 160;
  const centerX = 200;
  const centerY = 200;

  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const angle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
    const textRadius = radius * 0.65;
    return {
      x: centerX + textRadius * Math.cos(angle),
      y: centerY + textRadius * Math.sin(angle),
      rotation: (index + 0.5) * segmentAngle,
    };
  };

  return (
    // MOBILE FIX: Container fills parent width but has max constraint
    <div className="relative w-full aspect-square max-w-full mx-auto">
      {/* Outer steering wheel frame - MOBILE: Proportional scaling */}
      <div className="absolute inset-[-10%] rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl" />
      <div className="absolute inset-[-8.75%] rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-zinc-600" />
      
      {/* Grip texture rings */}
      <div className="absolute inset-[-7.5%] rounded-full border-4 sm:border-8 border-zinc-700" 
           style={{ 
             background: 'repeating-conic-gradient(from 0deg, #3f3f46 0deg 3deg, #27272a 3deg 6deg)' 
           }} 
      />
      
      {/* Red accent ring */}
      <div className="absolute inset-[-3.75%] rounded-full border-2 sm:border-4 border-racing-red box-glow-red" />

      {/* Main wheel - SVG fills container */}
      <svg
        ref={wheelRef}
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        className="relative z-10 transition-transform"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? "4s" : "0s",
          transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
        }}
      >
        <defs>
          <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor="#000" floodOpacity="0.5" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
          <linearGradient id="metal-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#888" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#333" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Segments */}
        {SEGMENTS.map((segment, index) => (
          <g key={index}>
            <path
              d={createSegmentPath(index)}
              fill={segment.color}
              stroke="#0a0a0a"
              strokeWidth="2"
            />
            <text
              x={getTextPosition(index).x}
              y={getTextPosition(index).y}
              fill={segment.textColor}
              fontSize="12"
              fontWeight="bold"
              fontFamily="Exo 2, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${getTextPosition(index).rotation}, ${getTextPosition(index).x}, ${getTextPosition(index).y})`}
            >
              {segment.label}
            </text>
          </g>
        ))}
        
        <circle cx={centerX} cy={centerY} r={radius} fill="url(#metal-shine)" />
        <circle cx={centerX} cy={centerY} r="55" fill="#1a1a1a" stroke="#3f3f46" strokeWidth="3" />
        <circle cx={centerX} cy={centerY} r="48" fill="#0a0a0a" stroke="#27272a" strokeWidth="2" />
        <circle cx={centerX} cy={centerY} r="42" fill="#18181b" />
        <circle cx={centerX} cy={centerY} r="35" fill="#DC2626" stroke="#b91c1c" strokeWidth="2" />
        <text
          x={centerX}
          y={centerY - 8}
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
          fontFamily="Russo One, sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          SPIN
        </text>
        <text
          x={centerX}
          y={centerY + 8}
          fill="#fff"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Exo 2, sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          TO WIN
        </text>
        
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const boltRadius = 28;
          const x = centerX + boltRadius * Math.cos((angle - 90) * Math.PI / 180);
          const y = centerY + boltRadius * Math.sin((angle - 90) * Math.PI / 180);
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
          );
        })}
      </svg>

      {/* Pointer - Proportional to container */}
      <div className="absolute top-[-11.25%] left-1/2 -translate-x-1/2 z-20 w-[12.5%] h-[15%]">
        <svg width="100%" height="100%" viewBox="0 0 50 60" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pointer-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#71717a" />
              <stop offset="50%" stopColor="#d4d4d8" />
              <stop offset="100%" stopColor="#52525b" />
            </linearGradient>
          </defs>
          <path
            d="M25 60 L10 20 L25 0 L40 20 Z"
            fill="url(#pointer-metal)"
            stroke="#DC2626"
            strokeWidth="3"
          />
          <path
            d="M25 55 L13 22 L25 5 L37 22 Z"
            fill="#DC2626"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Spokes - Proportional */}
      {[45, 135, 225, 315].map((angle, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-[2%] h-[24%] rounded-full origin-bottom z-0 bg-gradient-to-b from-zinc-600 to-zinc-800"
          style={{
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          }}
        />
      ))}

      {/* Click overlay */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || disabled}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30",
          "w-[24%] h-[24%] rounded-full cursor-pointer",
          "bg-transparent border-0",
          (isSpinning || disabled) && "cursor-not-allowed opacity-50"
        )}
        aria-label="Spin the wheel"
      />
      
      {/* Disabled overlay */}
      {disabled && !isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-black/80 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm">
            Come Back Tomorrow!
          </div>
        </div>
      )}
    </div>
  );
};
