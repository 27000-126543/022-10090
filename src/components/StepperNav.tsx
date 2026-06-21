import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepperNavProps {
  canGoBack: boolean;
  canGoForward: boolean;
  forwardLabel?: string;
  onBack: () => void;
  onForward: () => void;
}

export default function StepperNav({
  canGoBack,
  canGoForward,
  forwardLabel = '下一步',
  onBack,
  onForward,
}: StepperNavProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-blush-100">
      <motion.button
        className={`btn-secondary flex items-center gap-2 ${!canGoBack ? 'invisible' : ''}`}
        onClick={onBack}
        whileHover={canGoBack ? { scale: 1.02 } : {}}
        whileTap={canGoBack ? { scale: 0.98 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
        上一步
      </motion.button>

      <motion.button
        className="btn-primary flex items-center gap-2"
        onClick={onForward}
        disabled={!canGoForward}
        whileHover={canGoForward ? { scale: 1.02 } : {}}
        whileTap={canGoForward ? { scale: 0.98 } : {}}
      >
        {forwardLabel}
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
