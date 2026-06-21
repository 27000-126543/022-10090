import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function OptionCard({ label, selected, onClick, icon, subtitle }: OptionCardProps) {
  return (
    <motion.div
      className={cn(
        'option-card relative flex flex-col items-center justify-center min-h-[88px] gap-1',
        selected && 'option-card-selected'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-gold flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
      {icon && <div className="text-rose-gold mb-1">{icon}</div>}
      <span className={cn('font-medium text-center', selected ? 'text-rose-goldDark' : 'text-ink-700')}>
        {label}
      </span>
      {subtitle && <span className="text-xs text-ink-300">{subtitle}</span>}
    </motion.div>
  );
}
