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
  MessageSquareText,
  Package,
  Clock,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Flame,
  Users,
  ClipboardList,
} from 'lucide-react';
import { useAppStore } from '../store';
import type { ReceptionRecord, ProjectItem } from '../types';

const STATUS_CONFIG = {
  pushed: { label: '已推送', color: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
  pending: { label: '待接手', color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  accepted: { label: '已接手', color: 'bg-green-50 text-green-600 border-green-200', dot: 'bg-green-500' },
};

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export default function ReceptionResultStep() {
  const { result, questionnaire, queue, pushToQueue, resetForm, setViewMode } = useAppStore();
  const [pushed, setPushed] = useState(false);
  const [pushedId, setPushedId] = useState<string | null>(null);
  const [showQueue, setShowQueue] = useState(false);

  if (!result) return null;

  const currentRecord = pushedId ? queue.find((r) => r.id === pushedId) : null;
  const displayStatus = currentRecord ? currentRecord.status : 'pending';

  const handlePush = () => {
    const record: ReceptionRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      phone: questionnaire.phone,
      result,
      questionnaire: { ...questionnaire },
      status: 'pending',
      pushedAt: new Date().toISOString(),
    };
    pushToQueue(record);
    setPushedId(record.id);
    setPushed(true);
  };

  const categoryIcon = {
    皮肤管理: '✨',
    抗衰光电: '⚡',
    轮廓咨询: '👑',
  }[result.recommendedCategory];

  const currentTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const pendingCount = queue.filter((r) => r.status === 'pending').length;
  const sc = STATUS_CONFIG[displayStatus];

  return (
    <div className="w-full min-h-screen py-10 px-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1">
        <motion.div
          className="text-center mb-8"
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

            {result.dealReminder && (
              <div className="card p-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50/80 via-red-50/60 to-amber-50/80">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-ink-900 mb-2">到院成交提醒</h4>
                    <p className="text-red-700 leading-relaxed whitespace-pre-line">{result.dealReminder}</p>
                  </div>
                </div>
              </div>
            )}

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
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="card p-6 border-l-4 border-l-rose-gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <MessageSquareText className="w-5 h-5 text-rose-gold" />
                </div>
                <h3 className="font-serif text-xl text-ink-900">优先沟通话术</h3>
              </div>
              <p className="text-ink-700 leading-relaxed bg-blush-50 rounded-2xl p-5">
                {result.communicationScript}
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-serif text-xl text-ink-900">推荐项目方向（按优先级）</h3>
              </div>
              <div className="space-y-3">
                {result.recommendedProjects.map((proj: ProjectItem, i) => {
                  const badge = proj.priority === 1
                    ? { text: '首推', cls: 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white' }
                    : proj.priority === 2
                    ? { text: '次推', cls: 'bg-purple-100 text-purple-700' }
                    : { text: '备选', cls: 'bg-ink-300 text-white' };
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                    >
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${badge.cls}`}>
                        {badge.text}
                      </span>
                      <div className="flex-1">
                        <div className="text-purple-900 font-semibold text-base">{proj.name}</div>
                        {proj.reason && <div className="text-purple-600 text-sm mt-0.5">{proj.reason}</div>}
                      </div>
                    </motion.div>
                  );
                })}
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
                  <span className="text-ink-900 font-medium">{currentTime(result.submittedAt)}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-blush-100">
                  <span className="text-ink-500">咨询方向</span>
                  <span className="text-rose-gold font-medium">{result.recommendedCategory}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-blush-100">
                  <span className="text-ink-500">当前状态</span>
                  <span className={`tag-chip text-xs py-0.5 px-2 border ${sc.color}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${sc.dot}`} />
                    {sc.label}
                  </span>
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
                    <div className="text-ink-500 text-sm">
                      发送至 {result.consultantType} 的待办池
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="pushed"
                  className="w-full card p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <div className="font-serif text-lg text-green-700 mb-1">已推送至咨询师待办池</div>
                    <div className="text-green-600 text-sm">
                      {pendingCount > 0
                        ? `${pendingCount} 位客户等待 ${result.consultantType} 接手`
                        : '已发送，咨询师可立即查看'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-4 py-2.5 rounded-xl bg-white border border-blush-200 text-ink-700 text-sm font-medium hover:border-rose-gold hover:text-rose-gold transition-all flex items-center justify-center gap-1.5"
                      onClick={() => setViewMode('frontdesk')}
                    >
                      <ClipboardList className="w-4 h-4" />
                      前台队列
                    </button>
                    <button
                      className="px-4 py-2.5 rounded-xl bg-rose-gold/10 text-rose-goldDark text-sm font-medium hover:bg-rose-gold hover:text-white transition-all flex items-center justify-center gap-1.5"
                      onClick={() => setViewMode('consultant')}
                    >
                      <Users className="w-4 h-4" />
                      咨询师端
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="card overflow-hidden">
              <button
                className="w-full p-5 flex items-center justify-between hover:bg-blush-50 transition-colors"
                onClick={() => setShowQueue(!showQueue)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center">
                    <ListOrdered className="w-4 h-4 text-rose-gold" />
                  </div>
                  <span className="font-serif text-base text-ink-900">今日接待队列</span>
                  <span className="tag-chip bg-blush-100 text-rose-goldDark text-xs py-1 px-2">
                    {queue.length}
                  </span>
                </div>
                {showQueue ? (
                  <ChevronUp className="w-5 h-5 text-ink-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-300" />
                )}
              </button>

              <AnimatePresence>
                {showQueue && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 max-h-80 overflow-y-auto">
                      {queue.length === 0 && (
                        <p className="text-ink-300 text-sm text-center py-4">暂无接待记录</p>
                      )}
                      {queue.map((rec) => {
                        const rsc = STATUS_CONFIG[rec.status];
                        return (
                          <div
                            key={rec.id}
                            className={`flex items-center gap-3 p-3 rounded-xl ${
                              rec.id === pushedId ? 'bg-rose-gold/10 ring-1 ring-rose-gold/30' : 'bg-blush-50'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${rsc.dot}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-ink-900 text-sm font-medium truncate">
                                  {maskPhone(rec.phone)}
                                </span>
                                <span className="text-ink-300 text-xs">{currentTime(rec.pushedAt)}</span>
                              </div>
                              <div className="text-ink-500 text-xs">{rec.result.recommendedCategory}</div>
                            </div>
                            <span className={`tag-chip text-xs py-0.5 px-2 border ${rsc.color}`}>
                              {rsc.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="w-full card p-4 flex items-center justify-center gap-2 text-ink-500 hover:text-rose-gold hover:border-rose-goldLight transition-all border-2 border-transparent"
              onClick={resetForm}
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
