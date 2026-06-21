import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Sparkles,
  AlertTriangle,
  UserCheck,
  MessageSquareText,
  Package,
  Phone,
  MapPin,
  Clock,
  Heart,
  Activity,
  Wallet,
  Crown,
  Flame,
  Eye,
  ChevronDown,
  ChevronUp,
  ListOrdered,
} from 'lucide-react';
import { useAppStore } from '../store';
import type { ReceptionRecord, ProjectItem, RecordStatus } from '../types';

const CATEGORY_ICONS: Record<string, string> = {
  皮肤管理: '✨',
  抗衰光电: '⚡',
  轮廓咨询: '👑',
};

const STATUS_CONFIG: Record<RecordStatus, { label: string; color: string; dot: string }> = {
  pushed: { label: '已推送', color: 'bg-blue-50 text-blue-600 border border-blue-200', dot: 'bg-blue-500' },
  pending: { label: '待接手', color: 'bg-amber-50 text-amber-600 border border-amber-200', dot: 'bg-amber-500' },
  accepted: { label: '已接手', color: 'bg-green-50 text-green-600 border border-green-200', dot: 'bg-green-500' },
};

type StatusGroup = 'all' | RecordStatus;

const STATUS_GROUPS: { id: StatusGroup; label: string; icon: string }[] = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'pushed', label: '已推送', icon: '📤' },
  { id: 'pending', label: '待接手', icon: '⏳' },
  { id: 'accepted', label: '已接手', icon: '✅' },
];

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function isSameDay(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function RecordDetailCard({ record, onBack }: { record: ReceptionRecord; onBack: () => void }) {
  const { result, questionnaire } = record;
  const sc = STATUS_CONFIG[record.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <button
        className="flex items-center gap-2 text-ink-500 hover:text-rose-gold transition-colors mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回队列</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-gold to-rose-goldLight flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-serif text-2xl text-ink-900">{maskPhone(record.phone)}</div>
            <div className="text-ink-500 text-sm mt-0.5">
              {formatTime(record.pushedAt)} 推送
              {record.acceptedAt && record.acceptedBy && (
                <span className="ml-2">· {record.acceptedBy} {formatTime(record.acceptedAt)} 接手</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`tag-chip text-sm ${sc.color}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${sc.dot}`} />
            {sc.label}
          </span>
          <span className="tag-chip bg-blush-100 text-rose-goldDark">
            {CATEGORY_ICONS[result.recommendedCategory]} {result.recommendedCategory}
          </span>
        </div>
      </div>

      {result.dealReminder && (
        <div className="bg-gradient-to-r from-amber-50 to-red-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Flame className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 leading-relaxed whitespace-pre-line">{result.dealReminder}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <Phone className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">手机号（脱敏）</div>
            <div className="text-ink-900 font-medium">{maskPhone(questionnaire.phone)}</div>
          </div>
        </div>
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <MapPin className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">到店目的</div>
            <div className="text-ink-900 font-medium">{questionnaire.visitPurpose}</div>
          </div>
        </div>
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <Crown className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">咨询方向</div>
            <div className="text-ink-900 font-medium">{result.consultantType}</div>
          </div>
        </div>
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <Activity className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">过往经历</div>
            <div className="text-ink-900 font-medium">{questionnaire.pastExperience}</div>
          </div>
        </div>
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <Wallet className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">预算范围</div>
            <div className="text-ink-900 font-medium">{questionnaire.budgetRange}</div>
          </div>
        </div>
        <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-4 h-4 text-rose-gold mt-0.5" />
          <div>
            <div className="text-ink-500 text-xs mb-1">恢复期偏好</div>
            <div className="text-ink-900 font-medium">{questionnaire.recoveryAcceptable}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-ink-500 text-xs mb-2">关注部位</div>
          <div className="flex flex-wrap gap-2">
            {questionnaire.concernAreas.map((a) => (
              <span key={a} className="tag-chip bg-blush-100 text-rose-goldDark text-xs">{a}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-ink-500 text-xs mb-2">期望改善</div>
          <div className="flex flex-wrap gap-2">
            {questionnaire.expectedEffects.map((e) => (
              <span key={e} className="tag-chip bg-blush-100 text-rose-goldDark text-xs">{e}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-blush-100 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-rose-gold" />
          <h3 className="font-serif text-lg text-ink-900">接待标签</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {result.tags.map((tag) => (
            <span key={tag.id} className={`tag-chip text-sm ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>

        <div className="card p-4 border-l-4 border-l-rose-gold mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquareText className="w-4 h-4 text-rose-gold" />
            <span className="font-semibold text-ink-900 text-sm">优先沟通话术</span>
          </div>
          <p className="text-ink-700 leading-relaxed text-sm bg-blush-50 rounded-xl p-3">
            {result.communicationScript}
          </p>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-ink-900 text-sm">推荐项目方向</span>
          </div>
          <div className="space-y-2">
            {result.recommendedProjects.map((p: ProjectItem, i: number) => {
              const badge = p.priority === 1
                ? { text: '首推', cls: 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white' }
                : p.priority === 2
                ? { text: '次推', cls: 'bg-purple-100 text-purple-700' }
                : { text: '备选', cls: 'bg-ink-300 text-white' };
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.cls}`}>{badge.text}</span>
                  <div className="flex-1">
                    <span className="text-purple-900 font-semibold text-sm">{p.name}</span>
                    {p.reason && <span className="text-purple-600 text-xs ml-2">({p.reason})</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {result.avoidPoints.length > 0 && (
          <div className="card p-4 border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-ink-900 text-sm">沟通避坑提示</span>
            </div>
            <ul className="space-y-2">
              {result.avoidPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-600 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function FrontDeskQueue() {
  const { queue, setViewMode } = useAppStore();
  const [group, setGroup] = useState<StatusGroup>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const todayQueue = useMemo(() => queue.filter((r) => isSameDay(r.pushedAt)), [queue]);

  const stats = {
    all: todayQueue.length,
    pushed: todayQueue.filter((r) => r.status === 'pushed').length,
    pending: todayQueue.filter((r) => r.status === 'pending').length,
    accepted: todayQueue.filter((r) => r.status === 'accepted').length,
  };

  const filtered = useMemo(() => {
    let list = todayQueue;
    if (group !== 'all') list = list.filter((r) => r.status === group);
    if (search.trim()) {
      const kw = search.trim();
      list = list.filter((r) => {
        const last4 = r.phone.slice(-4);
        const matchPhone = last4.includes(kw);
        const matchCat = r.result.recommendedCategory.includes(kw);
        const matchLabel = r.result.tags.some((t) => t.label.includes(kw));
        const matchTime = formatTime(r.pushedAt).includes(kw);
        return matchPhone || matchCat || matchLabel || matchTime;
      });
    }
    return list;
  }, [todayQueue, group, search]);

  const grouped = useMemo(() => {
    if (group !== 'all') {
      return [{ key: group, title: STATUS_CONFIG[group].label, records: filtered }];
    }
    const order: RecordStatus[] = ['pushed', 'pending', 'accepted'];
    return order
      .map((s) => ({
        key: s,
        title: STATUS_CONFIG[s].label,
        records: filtered.filter((r) => r.status === s),
      }))
      .filter((g) => g.records.length > 0);
  }, [filtered, group]);

  const selectedRecord = selectedId ? todayQueue.find((r) => r.id === selectedId) : null;

  return (
    <div className="w-full min-h-screen py-8 px-8">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ink-900">前台队列总览</h1>
            <p className="text-ink-500 mt-1">
              今日录入 <span className="text-rose-gold font-semibold">{stats.all}</span> 位客户 ·
              已推送 <span className="text-blue-600 font-semibold">{stats.pushed}</span> ·
              待接手 <span className="text-amber-600 font-semibold">{stats.pending}</span> ·
              已接手 <span className="text-green-600 font-semibold">{stats.accepted}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="btn-secondary text-sm flex items-center gap-2"
              onClick={() => setViewMode('consultant')}
            >
              <Eye className="w-4 h-4" />
              咨询师入口
            </button>
            <button
              className="btn-primary text-sm flex items-center gap-2"
              onClick={() => {
                setSelectedId(null);
                setViewMode('tablet');
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              返回录入页
            </button>
          </div>
        </div>

        {!selectedRecord && (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full pl-11 pr-5 py-3 rounded-2xl border border-blush-200 bg-white text-ink-900 placeholder-ink-300 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all"
                  placeholder="搜索：手机号后四位 / 咨询方向 / 标签 / 时间"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 bg-blush-50 p-1 rounded-2xl">
                {STATUS_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      group === g.id
                        ? 'bg-white text-rose-goldDark shadow-card'
                        : 'text-ink-500 hover:text-ink-900'
                    }`}
                    onClick={() => setGroup(g.id)}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                    <span className={`tag-chip text-xs py-0.5 px-1.5 ${
                      g.id === 'all'
                        ? 'bg-rose-gold/10 text-rose-gold'
                        : STATUS_CONFIG[g.id as RecordStatus].color
                    }`}>
                      {stats[g.id as keyof typeof stats]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="card p-16 text-center">
                <div className="text-5xl mb-4">
                  {search ? '🔍' : '📋'}
                </div>
                <p className="text-ink-500 text-lg mb-2">
                  {search ? '没有匹配的客户记录' : '今天还没有录入的客户'}
                </p>
                <p className="text-ink-300 text-sm">
                  {search ? '请尝试更换关键词搜索' : '开始录入新客户后，客户会出现在这里'}
                </p>
              </div>
            )}

            <AnimatePresence>
              {grouped.map((g) => (
                <motion.div
                  key={g.key}
                  className="mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ListOrdered className="w-5 h-5 text-rose-gold" />
                    <h2 className="font-serif text-xl text-ink-900">{g.title}</h2>
                    <span className={`tag-chip text-sm ${STATUS_CONFIG[g.key as RecordStatus].color}`}>
                      {g.records.length} 位
                    </span>
                  </div>
                  <div className="space-y-3">
                    {g.records.map((rec, idx) => {
                      const sc = STATUS_CONFIG[rec.status];
                      return (
                        <motion.div
                          key={rec.id}
                          className="card p-4 flex items-center gap-5 hover:shadow-elegant transition-all cursor-pointer group"
                          onClick={() => setSelectedId(rec.id)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          whileHover={{ scale: 1.003 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blush-100 to-blush-200 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            {CATEGORY_ICONS[rec.result.recommendedCategory]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-ink-900 font-medium text-base">{maskPhone(rec.phone)}</span>
                              <span className={`tag-chip text-xs py-0.5 px-2 border ${sc.color}`}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${sc.dot}`} />
                                {sc.label}
                              </span>
                              {rec.result.dealReminder && (
                                <span className="tag-chip bg-rose-500 text-white text-xs py-0.5 px-2">
                                  🔥 高意向
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-ink-500 mb-1.5">
                              <span className="font-medium text-rose-goldDark">{rec.result.recommendedCategory}</span>
                              <span>·</span>
                              <span>推送 {formatTime(rec.pushedAt)}</span>
                              {rec.acceptedAt && (
                                <>
                                  <span>·</span>
                                  <span className="text-green-600">接手 {formatTime(rec.acceptedAt)}</span>
                                </>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {rec.result.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag.id}
                                  className="text-xs px-2 py-0.5 rounded-full bg-blush-50 text-ink-500 border border-blush-100 truncate max-w-[110px]"
                                >
                                  {tag.label}
                                </span>
                              ))}
                              {rec.result.tags.length > 4 && (
                                <span className="text-xs px-2 py-0.5 rounded-full text-ink-300">
                                  +{rec.result.tags.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <button
                              className="w-9 h-9 rounded-full bg-blush-50 flex items-center justify-center text-rose-gold hover:bg-rose-gold hover:text-white transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(rec.id);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-ink-300">查看详情</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence mode="wait">
          {selectedRecord && (
            <RecordDetailCard
              record={selectedRecord}
              onBack={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
