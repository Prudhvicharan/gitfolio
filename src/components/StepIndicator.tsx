import { Check } from 'lucide-react';
interface Props {
  currentStep: number;
  onStep: (step: number) => void;
  hasProfile: boolean;
}
export function StepIndicator({ currentStep, onStep, hasProfile }: Props) {
  return (
    <nav aria-label="Profile builder steps">
      <ol className="steps">
        {['Profile', 'Style', 'Review'].map((label, index) => (
          <li key={label} data-complete={currentStep > index + 1 || undefined}>
            <button
              onClick={() => onStep(index + 1)}
              disabled={index > 0 && !hasProfile}
              aria-current={currentStep === index + 1 ? 'step' : undefined}
            >
              <span className="step-number">
                {currentStep > index + 1 ? <Check size={15} /> : index + 1}
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
