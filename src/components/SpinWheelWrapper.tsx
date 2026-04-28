import { useState } from 'react';
import { SpinWheel } from './SpinWheel';
import { ResultDisplay } from './ResultDisplay';
import { Confetti } from './Confetti';

export default function SpinWheelWrapper() {
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSpinComplete = (spinResult: string) => {
    setResult(spinResult);
    setShowResult(true);
    setShowConfetti(true);
    
    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3500);
    
    // You can also save the result to your backend here
    console.log('User won:', spinResult);
  };

  return (
    <section className="max-w-7xl mx-auto px-10 lg:px-8 md:px-10 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">🏎️ Racing Wheel of Fortune</h2>
        <p className="text-muted-foreground">Spin the wheel and win amazing prizes!</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* The Spin Wheel */}
        <SpinWheel onSpinComplete={handleSpinComplete} />

        {/* Result Display */}
        <ResultDisplay result={result} isVisible={showResult} />

        {/* Confetti Effect */}
        <Confetti isActive={showConfetti} />
      </div>

      {/* Reset Button */}
      {showResult && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setShowResult(false);
              setResult(null);
            }}
            className="px-6 py-3 bg-racing-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Spin Again
          </button>
        </div>
      )}
    </section>
  );
}