import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAppStore } from '../store';

export default function WelcomeStep() {
  const { setStep, queue, setViewMode } = useAppStore();

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 4,
  }));

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-8">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-gold to-rose-goldLight flex items-center justify-center shadow-glow mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-12 h-12 text-white" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          className="font-serif text-5xl font-semibold text-ink-900 mb-4 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          欢迎光临
        </motion.h1>

        <motion.p
          className="font-serif text-2xl text-rose-gold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          开启您的专属美丽之旅
        </motion.p>

        <motion.p
          className="text-ink-500 text-lg leading-relaxed mb-12 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          为了让咨询师更好地了解您的需求，
          <br />
          请花一分钟时间填写一份简单的问卷。
        </motion.p>

        <motion.button
          className="btn-primary text-lg px-12 py-4 flex items-center gap-3"
          onClick={() => setStep('basic')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          开始填写
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.div
          className="flex items-center gap-2 mt-10 text-ink-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>您的信息将被严格保密，仅用于面诊参考</span>
        </motion.div>

        {queue.length > 0 && (
          <motion.button
            className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border border-blush-200 text-ink-500 hover:text-rose-gold hover:border-rose-goldLight transition-all text-sm"
            onClick={() => setViewMode('consultant')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserCheck className="w-4 h-4" />
            咨询师工作台
            <span className="ml-1 bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">
              {queue.filter((r) => r.status === 'pending').length} 待接手
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
