import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Gift, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { useBrands } from "@/hooks/useBrands";

const FALLBACK = "/brand-placeholder.png";

type Screen = "splash" | "welcome" | "onb1" | "onb2" | "onb3";

// ── Splash ─────────────────────────────────────────────────────────
function SplashScreen({ brands }: { brands: any[] }) {
  const pad = [...brands, ...brands, ...brands]; // ensure enough items
  const cols = [0, 3, 6, 1, 4].map(o =>
    Array.from({ length: 10 }, (_, i) => pad[(o + i) % Math.max(pad.length, 1)])
  );
  const getImg = (b: any) =>
    b?.Images?.text || b?.Images?.thumbnail || b?.Images?.featured || b?.Images?.base || null;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div className="absolute inset-0 flex gap-2 px-2 pt-10">
        {cols.map((col, ci) => (
          <div key={ci} className={`flex-1 flex flex-col gap-2 ${ci % 2 === 0 ? "g-col-up" : "g-col-down"}`}>
            {[...col, ...col].map((b, ji) => (
              <div key={ji} className="aspect-square rounded-2xl bg-white shadow-g-tile flex items-center justify-center p-2">
                {getImg(b)
                  ? <img src={getImg(b)!} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                  : <div className="w-full h-full bg-accent rounded-xl" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* White dissolve */}
      <div className="absolute inset-0 bg-white pointer-events-none"
        style={{ animation: "splashOut 3.8s ease-in forwards" }} />
      <style>{`@keyframes splashOut { 0%,60%{opacity:0} 100%{opacity:1} }`}</style>
    </div>
  );
}

// ── Welcome ────────────────────────────────────────────────────────
function WelcomeScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 35% 30%, #ffe4cc 0%, #fff0e8 35%, white 72%)" }}>
      <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: .8, type: "spring", bounce: .4 }}
        className="flex flex-col items-center gap-6">
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-g-card-lg g-float"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)" }}>
          <Gift size={60} color="white" />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-black"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Gift360
          </h1>
          <p className="text-muted-foreground text-base mt-2 font-semibold">Gift Smarter, Choose Freely</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Onboarding step wrapper ────────────────────────────────────────
interface StepProps { dotIndex: number; title: string; body: string; onNext: () => void; onBack: () => void; onSkip: () => void; isLast?: boolean; children: React.ReactNode; }

function OnbStep({ dotIndex, title, body, onNext, onBack, onSkip, isLast, children }: StepProps) {
  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Decorative circles based on step */}
      {dotIndex === 0 && <>
        <div className="absolute top-20 right-0 w-20 h-20 rounded-full bg-sky-200/60" />
        <div className="absolute top-36 left-5 w-4 h-4 rounded-full bg-sky-300" />
        <div className="absolute bottom-1/3 left-0 w-16 h-16 rounded-full bg-sky-200/60" />
      </>}
      {dotIndex === 1 && <>
        <div className="absolute top-24 right-0 w-20 h-20 rounded-full bg-violet-200/60" />
        <div className="absolute top-44 right-12 w-3 h-3 rounded-full bg-violet-300" />
        <div className="absolute bottom-1/3 left-0 w-20 h-20 rounded-full bg-violet-200/60" />
      </>}
      {dotIndex === 2 && <>
        <div className="absolute top-24 left-2 w-20 h-20 rounded-full bg-rose-200/60" />
        <div className="absolute top-16 left-20 w-4 h-4 rounded-full bg-rose-300" />
        <div className="absolute bottom-1/3 right-0 w-16 h-16 rounded-full bg-rose-200/60" />
      </>}

      {/* Hero area */}
      <div className="relative flex-1 flex items-center justify-center">{children}</div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-3">
        {[0,1,2].map(i => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{ width: i === dotIndex ? 24 : 8, height: 8, background: i === dotIndex ? "hsl(var(--primary))" : "hsl(var(--primary)/.25)" }} />
        ))}
      </div>

      {/* Copy */}
      <div className="px-8 text-center">
        <h2 className="text-2xl font-extrabold mb-2 text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{body}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-6 pt-8">
        <button onClick={dotIndex === 0 ? onSkip : onBack}
          className="text-base font-semibold text-muted-foreground font-sans">
          {dotIndex === 0 ? "Skip" : "Back"}
        </button>
        <button onClick={onNext}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-g-primary font-bold text-white transition-transform hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #9333ea)" }}>
          {isLast ? <Zap size={22} /> : <ChevronRight size={26} />}
        </button>
      </div>
    </div>
  );
}

// ── Onboarding 1 — Explore Brands ─────────────────────────────────
function Onb1({ brands, onNext, onBack, onSkip }: { brands: any[]; onNext:()=>void; onBack:()=>void; onSkip:()=>void }) {
  const orbitBrands = brands.slice(0, 8);
  const getImg = (b: any) => b?.Images?.text || b?.Images?.thumbnail || null;

  return (
    <OnbStep dotIndex={0} title="Explore Top Brands"
      body="Discover 300+ top brands across fashion, food, travel, and more. Find the perfect gift voucher for every occasion."
      onNext={onNext} onBack={onBack} onSkip={onSkip}>
      <div className="relative w-64 h-64">
        <div className="absolute inset-4 rounded-full bg-sky-100/60 blur-xl" />
        <div className="absolute inset-6 rounded-full bg-sky-50 flex items-center justify-center overflow-hidden">
          <div className="g-float"><Gift size={72} color="hsl(var(--primary))" /></div>
        </div>
        {/* Orbit */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {orbitBrands.map((b, i) => (
            <div key={i} className="absolute w-11 h-11 rounded-xl bg-white shadow-g-tile p-1.5"
              style={{ animation:"orbit 12s linear infinite", animationDelay:`${(-12/orbitBrands.length)*i}s`, "--orbit-r":"110px" } as React.CSSProperties}>
              {getImg(b)
                ? <img src={getImg(b)!} alt="" className="w-full h-full object-contain" onError={e=>{(e.target as HTMLImageElement).src=FALLBACK}} />
                : <div className="w-full h-full bg-accent rounded-lg" />}
            </div>
          ))}
        </div>
        {/* Floating voucher tag */}
        <div className="absolute left-0 top-8 bg-white rounded-xl shadow-g-card px-2 py-1.5 g-bob z-10">
          <div className="text-[10px] font-extrabold text-foreground">Gift 360</div>
          <div className="text-[7px] tracking-widest text-muted-foreground mt-0.5">|||||||||</div>
        </div>
        <style>{`@keyframes orbit{from{transform:rotate(0deg) translateX(var(--orbit-r,110px)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--orbit-r,110px)) rotate(-360deg)}}`}</style>
      </div>
    </OnbStep>
  );
}

// ── Onboarding 2 — Buy in Seconds ─────────────────────────────────
function Onb2({ brands, onNext, onBack, onSkip }: { brands: any[]; onNext:()=>void; onBack:()=>void; onSkip:()=>void }) {
  const [phase, setPhase] = useState<0|1>(0);
  useEffect(() => { const id = setInterval(() => setPhase(p => p===0?1:0), 2500); return ()=>clearInterval(id); }, []);
  const bannerBrands = brands.slice(0, 10);
  const getImg = (b: any) => b?.Images?.text || b?.Images?.thumbnail || null;

  return (
    <OnbStep dotIndex={1} title="Buy in Seconds"
      body="Get a smooth and secure buying experience with instant voucher purchases from top brands anytime, anywhere."
      onNext={onNext} onBack={onBack} onSkip={onSkip}>
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Soft bg */}
        <div className="absolute w-64 h-64 rounded-full bg-violet-50" />
        {/* Streaming brands banner */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 overflow-hidden">
          <div className="flex gap-3 items-center g-marq-rtl w-max px-4">
            {[...bannerBrands, ...bannerBrands].map((b, i) => (
              <div key={i} className="w-12 h-12 rounded-xl bg-white shadow-g-tile p-1.5 flex items-center justify-center shrink-0">
                {getImg(b) ? <img src={getImg(b)!} alt="" className="w-full h-full object-contain" onError={e=>{(e.target as HTMLImageElement).src=FALLBACK}} /> : <div className="w-full h-full bg-accent rounded-lg" />}
              </div>
            ))}
          </div>
        </div>
        {/* Phone mockup */}
        <div className="relative w-32 h-56 rounded-[24px] bg-white shadow-g-card-lg border-[3px] border-foreground/90 overflow-hidden z-10 g-fade-up">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-foreground/90 rounded-full" />
          <div className="pt-6 px-3 h-full flex flex-col items-center">
            <p className="text-[10px] font-extrabold text-center leading-tight">
              {phase === 0 ? "Voucher\nPurchased" : "Voucher\nDelivered!"}
            </p>
            <div className="flex-1 flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {phase === 0
                  ? <motion.div key="shield" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{background:"linear-gradient(135deg,hsl(var(--primary)),#9333ea)"}}>
                      <ShieldCheck size={28} color="white" />
                    </motion.div>
                  : <motion.div key="check" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}} className="relative">
                      <CheckCircle2 size={44} color="#10b981" />
                    </motion.div>
                }
              </AnimatePresence>
            </div>
            {phase === 0 && <div className="mb-3 px-3 py-1 rounded-full text-white text-[9px] font-bold" style={{background:"linear-gradient(135deg,hsl(var(--primary)),#9333ea)"}}>Pay Now</div>}
          </div>
        </div>
      </div>
    </OnbStep>
  );
}

// ── Onboarding 3 — Instant Delivery ───────────────────────────────
function Onb3({ onNext, onBack, onSkip }: { onNext:()=>void; onBack:()=>void; onSkip:()=>void }) {
  return (
    <OnbStep dotIndex={2} title="Instant Delivery & Redeem"
      body="Your gift voucher is delivered instantly and ready to use. Redeem it easily online or at nearby stores without any delays."
      onNext={onNext} onBack={onBack} onSkip={onSkip} isLast>
      <div className="relative w-52 h-52 g-float">
        <div className="absolute inset-0 -m-4 rounded-full bg-rose-100/60 blur-xl" />
        <div className="relative w-full h-full rounded-full bg-rose-50 flex flex-col items-center justify-center gap-2">
          <CheckCircle2 size={60} color="#f43f5e" />
          <p className="text-sm font-extrabold text-foreground">Voucher Ready!</p>
          <div className="flex gap-1">
            {["#f43f5e","hsl(var(--primary))","#f59e0b","#10b981"].map((c,i) => (
              <motion.div key={i} animate={{y:[0,-6,0]}} transition={{duration:.8,delay:i*.15,repeat:Infinity}}
                className="w-2 h-2 rounded-full" style={{background:c}} />
            ))}
          </div>
        </div>
      </div>
    </OnbStep>
  );
}

// ── Main Onboarding controller ─────────────────────────────────────
export default function Onboarding() {
  const [screen, setScreen] = useState<Screen>("splash");
  const { data: brands = [] } = useBrands();

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("welcome"), 3800);
      return () => clearTimeout(t);
    }
    if (screen === "welcome") {
      const t = setTimeout(() => setScreen("onb1"), 2200);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const finish = () => {
    localStorage.setItem("g360_onboarding_v2", "true");
    window.location.reload();
  };

  const screens: Record<Screen, React.ReactNode> = {
    splash: <SplashScreen brands={brands} />,
    welcome: <WelcomeScreen />,
    onb1: <Onb1 brands={brands} onNext={() => setScreen("onb2")} onBack={() => setScreen("welcome")} onSkip={finish} />,
    onb2: <Onb2 brands={brands} onNext={() => setScreen("onb3")} onBack={() => setScreen("onb1")} onSkip={finish} />,
    onb3: <Onb3 onNext={finish} onBack={() => setScreen("onb2")} onSkip={finish} />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--background)) 60%, hsl(280 60% 95%))" }}>
      <div className="w-full max-w-sm h-[90vh] max-h-[844px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-foreground/90 relative"
        style={{ boxShadow:"0 30px 80px -10px rgba(0,0,0,0.4)" }}>
        <div className="w-full h-full relative bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={screen} className="absolute inset-0"
              initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:1.02 }}
              transition={{ duration:.35 }}>
              {screens[screen]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
