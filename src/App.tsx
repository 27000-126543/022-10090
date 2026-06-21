import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store';
import WelcomeStep from './pages/WelcomeStep';
import BasicInfoStep from './pages/BasicInfoStep';
import PreferenceStep from './pages/PreferenceStep';
import RiskNoticeStep from './pages/RiskNoticeStep';
import SubmitStep from './pages/SubmitStep';
import ReceptionResultStep from './pages/ReceptionResultStep';

const stepVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function App() {
  const currentStep = useAppStore((s) => s.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'basic':
        return <BasicInfoStep />;
      case 'preference':
        return <PreferenceStep />;
      case 'risk':
        return <RiskNoticeStep />;
      case 'submit':
        return <SubmitStep />;
      case 'result':
        return <ReceptionResultStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="min-h-screen w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
