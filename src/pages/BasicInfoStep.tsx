import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import ProgressHeader from '../components/ProgressHeader';
import OptionCard from '../components/OptionCard';
import StepperNav from '../components/StepperNav';
import { useAppStore } from '../store';
import { VISIT_PURPOSES, CONCERN_AREAS, EXPECTED_EFFECTS } from '../types';

const MOCK_CODE = '8888';
const CODE_COUNTDOWN = 60;

export default function BasicInfoStep() {
  const { questionnaire, updateQuestionnaire, setStep } = useAppStore();
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const phoneValid = /^1[3-9]\d{9}$/.test(questionnaire.phone);
  const verified = questionnaire.verified;

  const handleSendCode = useCallback(() => {
    if (!phoneValid) {
      setPhoneError('请输入正确的手机号');
      return;
    }
    setPhoneError('');
    setCodeSent(true);
    setCodeError('');
    setCode('');
    setCountdown(CODE_COUNTDOWN);
  }, [phoneValid]);

  const handleVerifyCode = useCallback(() => {
    if (code === MOCK_CODE) {
      setCodeError('');
      updateQuestionnaire({ verified: true });
    } else {
      setCodeError('验证码错误，请重新输入');
    }
  }, [code, updateQuestionnaire]);

  const toggleArrayItem = (field: 'concernAreas' | 'expectedEffects', value: string) => {
    const current = questionnaire[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateQuestionnaire({ [field]: updated } as Partial<typeof questionnaire>);
  };

  const canProceed =
    verified &&
    questionnaire.visitPurpose &&
    questionnaire.concernAreas.length > 0 &&
    questionnaire.expectedEffects.length > 0;

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <ProgressHeader currentStep={1} totalSteps={4} stepName="基础诉求" />

        <motion.div
          className="card p-8 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">手机号核验</h3>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="tel"
                  className="input-field"
                  placeholder="请输入您的手机号"
                  maxLength={11}
                  value={questionnaire.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    updateQuestionnaire({ phone: v, verified: false });
                    setPhoneError('');
                    if (codeSent) {
                      setCodeSent(false);
                      setCode('');
                      setCodeError('');
                      setCountdown(0);
                    }
                  }}
                  disabled={verified}
                />
                {phoneError && (
                  <p className="text-red-400 text-sm mt-2">{phoneError}</p>
                )}
              </div>
              {!verified ? (
                <button
                  className={`px-6 py-3.5 rounded-2xl font-medium transition-all whitespace-nowrap ${
                    countdown > 0
                      ? 'bg-blush-100 text-ink-300 cursor-not-allowed'
                      : 'bg-rose-gold text-white hover:bg-rose-goldLight'
                  }`}
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : codeSent ? '重新发送' : '获取验证码'}
                </button>
              ) : (
                <div className="px-6 py-3.5 rounded-2xl bg-green-50 text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  已核验
                </div>
              )}
            </div>
            {codeSent && !verified && (
              <div className="mt-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="请输入验证码"
                    maxLength={6}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && code.length >= 4) handleVerifyCode();
                    }}
                  />
                  <button
                    className="btn-secondary"
                    onClick={handleVerifyCode}
                    disabled={code.length < 4}
                  >
                    验证
                  </button>
                </div>
                {codeError && (
                  <motion.p
                    className="text-red-400 text-sm mt-2"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {codeError}
                  </motion.p>
                )}
                <p className="text-ink-300 text-xs mt-2">
                  演示模式：验证码为 {MOCK_CODE}
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">到店目的</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {VISIT_PURPOSES.map((p) => (
                <OptionCard
                  key={p}
                  label={p}
                  selected={questionnaire.visitPurpose === p}
                  onClick={() => updateQuestionnaire({ visitPurpose: p })}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">关注部位（可多选）</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {CONCERN_AREAS.map((a) => (
                <OptionCard
                  key={a}
                  label={a}
                  selected={questionnaire.concernAreas.includes(a)}
                  onClick={() => toggleArrayItem('concernAreas', a)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-gold" />
              <h3 className="font-serif text-xl text-ink-900">期望改善效果（可多选）</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {EXPECTED_EFFECTS.map((e) => (
                <OptionCard
                  key={e}
                  label={e}
                  selected={questionnaire.expectedEffects.includes(e)}
                  onClick={() => toggleArrayItem('expectedEffects', e)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <StepperNav
          canGoBack={true}
          canGoForward={canProceed}
          onBack={() => setStep('welcome')}
          onForward={() => setStep('preference')}
        />
      </div>
    </div>
  );
}
