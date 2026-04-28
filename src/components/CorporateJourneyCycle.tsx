// components/CorporateJourneyCycle.tsx
// Visual representation of Corporate Rewards lifecycle
import { ArrowRight, Gift, DollarSign, Users, Upload, Award, LogIn, Tag, CheckCircle } from "lucide-react";

export default function CorporateJourneyCycle() {
  const employerSteps = [
    { text: "Select Voucher", icon: Gift },
    { text: "Select Denomination", icon: DollarSign },
    { text: "Add to Employee Batch", icon: Users },
    { text: "Upload Employee Excel", icon: Upload },
    { text: "Redeem Rewards", icon: Award }
  ];

  const employeeSteps = [
    { text: "Employee logs into gif360.io", icon: LogIn },
    { text: "Selects gift voucher", icon: Gift },
    { text: "Selects denomination", icon: Tag },
    { text: "Clicks redeem", icon: CheckCircle }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-900">
        Corporate Rewards Journey
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
        {/* Left Card - Employer Journey */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 flex flex-col h-full">
          <div className="text-center mb-4">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
              <h3 className="text-base font-bold text-purple-700">
                Corporate Scheme Rollout
              </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {employerSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{step.text}</p>
                    <p className="text-xs text-purple-600">Step {index + 1}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Logo - Corporate Journey */}
        <div className="flex justify-center items-center relative">
          {/* Arrow Left (hidden on mobile) */}
          <div className="hidden lg:block absolute -left-8 text-purple-400">
            <ArrowRight className="h-8 w-8" />
          </div>
          
          <div className="relative z-10">
            <img 
              src="/corporate-journey-logo.jpg" 
              alt="Corporate Journey" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-xl"
            />
          </div>
          
          {/* Arrow Right (hidden on mobile) */}
          <div className="hidden lg:block absolute -right-8 text-purple-400">
            <ArrowRight className="h-8 w-8" />
          </div>
        </div>

        {/* Right Card - Employee Journey */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 flex flex-col h-full">
          <div className="text-center mb-4">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-lg">
              <h3 className="text-base font-bold text-indigo-700">
                Employee Redemption
              </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {employeeSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-600 text-white flex items-center justify-center">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{step.text}</p>
                    <p className="text-xs text-indigo-600">Step {index + 1}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
