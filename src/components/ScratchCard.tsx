// components/ScratchCard.tsx
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, CreditCard, Lock } from "lucide-react";

interface ScratchCardProps {
  cardNumber: string;
  cardPin: string;
  expiryDate: string;
  amount: string;
  index: number;
}

export function ScratchCard({ cardNumber, cardPin, expiryDate, amount, index }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Create sophisticated gradient with gold/amber theme
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#fbbf24"); // Warm gold
    gradient.addColorStop(0.3, "#f59e0b"); // Amber
    gradient.addColorStop(0.6, "#d97706"); // Dark amber
    gradient.addColorStop(1, "#ea580c"); // Orange accent

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add shimmer effect overlay
    const shimmer = ctx.createLinearGradient(0, 0, rect.width, 0);
    shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
    shimmer.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
    shimmer.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add elegant text overlay
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillText("✨ Scratch to Reveal", rect.width / 2, rect.height / 2 - 8);
    
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.shadowBlur = 6;
    ctx.fillText("Your Gift Card Details", rect.width / 2, rect.height / 2 + 12);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const posX = (x - rect.left) * dpr;
    const posY = (y - rect.top) * dpr;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(posX, posY, 35 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
    checkScratchPercentage(ctx, canvas);
  };

  const checkScratchPercentage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isScratched) {
      setIsScratched(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ease-out ${
      isScratched ? "ring-2 ring-amber-400 shadow-xl shadow-amber-200/50" : "hover:shadow-lg"
    } bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800`}>
      <CardContent className="p-5">
        {/* Background content - The actual voucher */}
        <div className="relative z-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Gift Voucher</p>
                <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Card #{index + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Value</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ₹{amount}
              </p>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-2.5">
            {/* Card Number */}
            <div className="group p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1.5">
                <CreditCard className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Card Number</p>
              </div>
              <p className="font-mono font-bold text-base tracking-wide text-slate-800 dark:text-slate-100">
                {cardNumber}
              </p>
            </div>

            {/* Card PIN */}
            <div className="group p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1.5">
                <Lock className="h-3.5 w-3.5 text-orange-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Card PIN</p>
              </div>
              <p className="font-mono font-bold text-base tracking-widest text-slate-800 dark:text-slate-100">
                {cardPin}
              </p>
            </div>

            {/* Footer - Expiry & Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <div>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Expires</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{expiryDate}</p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-xs font-bold shadow-sm">
                ✓ Active
              </div>
            </div>
          </div>
        </div>

        {/* Scratch layer */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing w-full h-full touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "none" }}
          />
        )}

        {/* Scratch progress indicator */}
        {!isScratched && scratchPercentage > 5 && scratchPercentage < 50 && (
          <div className="absolute top-3 right-3 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400">
            {Math.round(scratchPercentage)}%
          </div>
        )}

        {/* Revealed animation */}
        {isScratched && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-orange-400/10 animate-pulse" />
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
              🎉 Revealed!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}