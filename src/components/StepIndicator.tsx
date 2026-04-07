import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="flex items-center w-full max-w-lg mx-auto mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDone ? (
                  <Check size={14} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </motion.div>
              <span className={`text-xs font-mono whitespace-nowrap hidden sm:block ${isActive ? 'text-indigo-400' : isDone ? 'text-emerald-500' : 'text-gray-600'}`}>
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={`step-line mx-2 ${isDone ? 'done' : isActive ? 'active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
