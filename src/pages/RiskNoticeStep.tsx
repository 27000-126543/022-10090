import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';
import ProgressHeader from '../components/ProgressHeader';
import OptionCard from '../components/OptionCard';
import StepperNav from '../components/StepperNav';
import { useAppStore } from '../store';
import { DEAL_INTENTIONS } from '../types';

export default function RiskNoticeStep() {
  const { questionnaire, updateQuestionnaire, setStep } = useAppStore();

  const canProceed = questionnaire.dealIntention !== '';

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <ProgressHeader currentStep={3} totalSteps={4} stepName="风险提示" />

        <motion.div
          className="card p-8 flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-blush-50 to-blush-100 rounded-2xl p-6 mb-8 border border-blush-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-rose-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg text-ink-900 mb-2">信息保密承诺</h4>
                <p className="text-ink-500 leading-relaxed">
                  您所填写的所有个人信息和诉求，仅用于本次面诊的专业参考，
                  我们将严格按照《个人信息保护法》进行保密处理，
                  不会向任何第三方泄露。您可以安心填写。
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg text-ink-900 mb-2">温馨提示</h4>
                <ul className="text-ink-500 leading-relaxed space-y-1">
                  <li>• 医美项目存在个体差异，效果因人而异</li>
                  <li>• 请如实告知您的健康状况和过往经历</li>
                  <li>• 最终方案需由医师面诊后确定</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">本次到店意向</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {DEAL_INTENTIONS.map((d) => (
                <OptionCard
                  key={d}
                  label={d}
                  selected={questionnaire.dealIntention === d}
                  onClick={() => updateQuestionnaire({ dealIntention: d })}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <StepperNav
          canGoBack={true}
          canGoForward={canProceed}
          forwardLabel="提交信息"
          onBack={() => setStep('preference')}
          onForward={() => setStep('submit')}
        />
      </div>
    </div>
  );
}
