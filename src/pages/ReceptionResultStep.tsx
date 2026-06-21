import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  UserCheck,
  Send,
  CheckCircle2,
  RotateCcw,
  Crown,
} from 'lucide-react';
import { useAppStore } from '../store';

export default function ReceptionResultStep() {
  const { result, reset } = useAppStore();
  const [pushed, setPushed] = useState(false);

  if (!result) return null;

  const handlePush = () => {
    setPushed(true);
  };

  const categoryIcon = {
    皮肤管理: '✨',
    抗衰光电: '⚡',
    轮廓咨询: '👑',
  }[result.recommendedCategory];

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-gold to-rose-goldLight text-white text-sm font-medium mb-4 shadow-glow">
            <Sparkles className="w-4 h-4" />
            接待画像已生成
          </div>
          <h1 className="font-serif text-4xl text-ink-900">接待提醒</h1>
          <p className="text-ink-500 mt-2">请前台/咨询师查看以下信息</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <motion.div
            className="col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold to-rose-goldLight flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif text-xl text-ink-900">推荐咨询方向</h3>
              </div>

              <div className="bg-gradient-to-br from-blush-50 via-blush-100 to-blush-50 rounded-3xl p-8 text-center border-2 border-rose-gold/30 shadow-elegant">
                <div className="text-5xl mb-3">{categoryIcon}</div>
                <div className="font-serif text-3xl text-rose-goldDark font-semibold mb-2">
                  {result.recommendedCategory}
                </div>
                <div className="text-ink-500">
                  分配咨询师：<span className="text-ink-900 font-medium">{result.consultantType}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-rose-gold" />
                </div>
                <h3 className="font-serif text-xl text-ink-900">接待标签</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {result.tags.map((tag, i) => (
                  <motion.span
                    key={tag.id}
                    className={`tag-chip ${tag.color}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>
            </div>

            {result.avoidPoints.length > 0 && (
              <div className="card p-6 border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-serif text-xl text-ink-900">沟通避坑提示</h3>
                </div>
                <ul className="space-y-3">
                  {result.avoidPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 bg-white rounded-xl p-4 border border-red-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-red-600">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-serif text-xl text-ink-900">客户信息</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-blush-100">
                  <span className="text-ink-500">提交时间</span>
                  <span className="text-ink-900 font-medium">
                    {result.submittedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-blush-100">
                  <span className="text-ink-500">咨询方向</span>
                  <span className="text-rose-gold font-medium">{result.recommendedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">标签数量</span>
                  <span className="text-ink-900 font-medium">{result.tags.length} 个</span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!pushed ? (
                <motion.button
                  key="push"
                  className="w-full card p-6 cursor-pointer hover:shadow-elegant transition-all group border-2 border-rose-gold/30 hover:border-rose-gold"
                  onClick={handlePush}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-gold to-rose-goldLight flex items-center justify-center mb-3 shadow-glow group-hover:scale-110 transition-transform">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-serif text-lg text-ink-900 mb-1">推送咨询师</div>
                    <div className="text-ink-500 text-sm">将画像发送给{result.consultantType}</div>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="pushed"
                  className="w-full card p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <div className="font-serif text-lg text-green-700 mb-1">已成功推送</div>
                    <div className="text-green-600 text-sm">{result.consultantType}将很快接待您</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="w-full card p-4 flex items-center justify-center gap-2 text-ink-500 hover:text-rose-gold hover:border-rose-goldLight transition-all border-2 border-transparent"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新开始新问卷</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
