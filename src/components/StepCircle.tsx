// components/StepCircle.tsx
// Vertical workflow steps with icons and descriptions
// components/StepCircle.tsx
// Vertical workflow steps with icons and descriptions
import type { ReactNode } from 'react';
import { Square, CheckSquare } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  status?: 'completed' | 'pending';
  onClick?: () => void;
  actionText?: string;
}

interface StepCircleProps {
  steps: Step[];
}

export default function StepCircle({ steps }: StepCircleProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* Steps */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Left side - Number badge with connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Number badge */}
              <div className="px-5 py-3 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center text-xl font-bold shadow-lg z-10">
                {step.id}
              </div>
              
              {/* Dotted connector line */}
              {index < steps.length - 1 && (
                <div className="w-0.5 h-full border-l-2 border-dotted border-purple-300 mt-2" />
              )}
            </div>

            {/* Right side - Step card */}
            <div 
              className={`flex-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all px-4 py-3 border border-white/50 ${
                step.onClick ? 'cursor-pointer hover:border-purple-400 hover:bg-white/80' : ''
              }`}
              onClick={step.onClick}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Text content */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-3">
                    {/* Checkbox icon based on status */}
                    {step.status === 'completed' ? (
                      <CheckSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : step.status === 'pending' ? (
                      <Square className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : null}
                    <h3 className="text-base font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    {step.description}
                  </p>
                  {step.actionText && (
                    <p className="text-xs text-purple-600 font-semibold pt-1 hover:underline">
                      {step.actionText}
                    </p>
                  )}
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
