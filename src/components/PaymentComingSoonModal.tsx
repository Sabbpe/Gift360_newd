// components/PaymentComingSoonModal.tsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentComingSoonModal({ isOpen, onClose }: PaymentComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background border-2 border-primary/20 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Animated Construction Tape - Top */}
        <div className="h-2 bg-gradient-to-r from-primary via-yellow-500 to-primary" />
        
        <div className="p-8 sm:p-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Construction Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Rotating gear background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-primary/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              
              {/* Icon container */}
              <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/30">
                <div className="text-5xl animate-bounce">
                  🚧
                </div>
              </div>
              
              {/* Floating tools */}
              <div className="absolute -top-2 -right-2 text-2xl">
                🔧
              </div>
              <div className="absolute -bottom-2 -left-2 text-2xl">
                ⚙️
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">
                Under Construction
              </h2>
              <p className="text-lg text-muted-foreground">
                We're Building Something Great!
              </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-muted/50 rounded-2xl p-6 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Secure Infrastructure</p>
                  <p className="text-xs text-muted-foreground">Complete ✓</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Payment Gateway Integration</p>
                  <p className="text-xs text-muted-foreground">In Progress...</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-muted-foreground">Testing & Launch</p>
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Your cart items are <span className="font-semibold text-primary">safely saved</span>. 
                We're working hard to bring you a seamless payment experience with 
                multiple payment options.
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Got it!
            </Button>
          </div>
        </div>

        {/* Animated Construction Tape - Bottom */}
        <div className="h-2 bg-gradient-to-r from-yellow-500 via-primary to-yellow-500" />
      </div>
    </div>
  );
}
