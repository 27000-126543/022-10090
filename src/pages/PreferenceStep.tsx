import { motion } from 'framer-motion';
import { Clock, Wallet, Heart, Activity } from 'lucide-react';
import ProgressHeader from '../components/ProgressHeader';
import OptionCard from '../components/OptionCard';
import StepperNav from '../components/StepperNav';
import { useAppStore } from '../store';
import { PAST_EXPERIENCES, RECOVERY_OPTIONS, BUDGET_RANGES } from '../types';

export default function PreferenceStep() {
  const { questionnaire, updateQuestionnaire, setStep } = useAppStore();

  const canProceed =
    questionnaire.pastExperience &&
    questionnaire.recoveryAcceptable &&
    questionnaire.budgetRange &&
    questionnaire.afraidOfPain !== null;

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <ProgressHeader currentStep={2} totalSteps={4} stepName="消费偏好" />

        <motion.div
          className="card p-8 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">过往医美经历</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {PAST_EXPERIENCES.map((e) => (
                <OptionCard
                  key={e}
                  label={e}
                  selected={questionnaire.pastExperience === e}
                  onClick={() => updateQuestionnaire({ pastExperience: e })}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">可接受恢复期</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {RECOVERY_OPTIONS.map((r) => (
                <OptionCard
                  key={r}
                  label={r}
                  selected={questionnaire.recoveryAcceptable === r}
                  onClick={() => updateQuestionnaire({ recoveryAcceptable: r })}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">预算范围</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {BUDGET_RANGES.map((b) => (
                <OptionCard
                  key={b}
                  label={b}
                  selected={questionnaire.budgetRange === b}
                  onClick={() => updateQuestionnaire({ budgetRange: b })}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">是否怕痛</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <OptionCard
                label="不怕痛"
                subtitle="对疼痛耐受度较好"
                selected={questionnaire.afraidOfPain === false}
                onClick={() => updateQuestionnaire({ afraidOfPain: false })}
              />
              <OptionCard
                label="比较怕痛"
                subtitle="希望尽量无痛"
                selected={questionnaire.afraidOfPain === true}
                onClick={() => updateQuestionnaire({ afraidOfPain: true })}
              />
            </div>
          </div>
        </motion.div>

        <StepperNav
          canGoBack={true}
          canGoForward={canProceed}
          onBack={() => setStep('basic')}
          onForward={() => setStep('risk')}
        />
      </div>
    </div>
  );
}
