import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export default function ProgressHeader({ currentStep, totalSteps, stepName }: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-gold" />
          <span className="text-sm text-ink-500">第 {currentStep} / {totalSteps} 步</span>
        </div>
        <span className="font-serif text-lg text-ink-900">{stepName}</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
