import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Sparkles,
  User,
  MapPin,
  Clock,
  Wallet,
  Heart,
  Activity,
} from 'lucide-react';
import { useAppStore } from '../store';
import { generateReceptionResult } from '../utils/tagGenerator';

export default function SubmitStep() {
  const { questionnaire, setStep, setResult } = useAppStore();
  const [stage, setStage] = useState<'confirm' | 'generating' | 'done'>('confirm');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage === 'generating') {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            const result = generateReceptionResult(questionnaire);
            setResult(result);
            setStage('done');
            setTimeout(() => setStep('result'), 1500);
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage, questionnaire, setResult, setStep]);

  const handleSubmit = () => {
    setStage('generating');
  };

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 'confirm' && (
          <motion.div
            key="confirm"
            className="card p-8 max-w-3xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl text-ink-900 mb-2">请确认您的信息</h2>
              <p className="text-ink-500">提交后将为您生成专属接待标签</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm">联系方式</span>
                </div>
                <p className="text-ink-700">{questionnaire.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium text-sm">到店目的</span>
                </div>
                <p className="text-ink-700">{questionnaire.visitPurpose}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">关注部位</span>
                </div>
                <p className="text-ink-700">{questionnaire.concernAreas.join('、')}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">期望效果</span>
                </div>
                <p className="text-ink-700">{questionnaire.expectedEffects.join('、')}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium text-sm">过往经历</span>
                </div>
                <p className="text-ink-700">{questionnaire.pastExperience}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">恢复期</span>
                </div>
                <p className="text-ink-700">{questionnaire.recoveryAcceptable}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium text-sm">预算范围</span>
                </div>
                <p className="text-ink-700">{questionnaire.budgetRange}</p>
              </div>

              <div className="bg-blush-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-gold">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium text-sm">痛感耐受</span>
                </div>
                <p className="text-ink-700">{questionnaire.afraidOfPain ? '比较怕痛' : '不怕痛'}</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button className="btn-secondary" onClick={() => setStep('risk')}>
                返回修改
              </button>
              <motion.button
                className="btn-primary text-lg px-10 py-4 flex items-center gap-2"
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                确认提交
              </motion.button>
            </div>
          </motion.div>
        )}

        {(stage === 'generating' || stage === 'done') && (
          <motion.div
            key="generating"
            className="card p-12 max-w-lg w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{
                background: stage === 'done'
                  ? 'linear-gradient(135deg, #10b981, #34d399)'
                  : 'linear-gradient(135deg, #C9A27C, #D4B58F)',
              }}
              animate={stage === 'generating' ? { rotate: 360 } : {}}
              transition={stage === 'generating' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            >
              {stage === 'done' ? (
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              ) : (
                <Sparkles className="w-12 h-12 text-white" />
              )}
            </motion.div>

            <h3 className="font-serif text-2xl text-ink-900 mb-4">
              {stage === 'done' ? '接待标签生成完成！' : '正在生成接待标签...'}
            </h3>
            <p className="text-ink-500 mb-8">
              {stage === 'done' ? '正在为您安排专属咨询师' : '正在智能分析您的需求画像'}
            </p>

            <div className="progress-bar max-w-xs mx-auto">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-ink-300 text-sm mt-3">{progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
