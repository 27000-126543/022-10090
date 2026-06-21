import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  Filter,
  MessageSquareText,
  Package,
  Crown,
  Phone,
  MapPin,
  Clock,
  Heart,
  Activity,
  Wallet,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store';
import type { ReceptionRecord } from '../types';

type CategoryFilter = '全部' | '皮肤管理' | '抗衰光电' | '轮廓咨询';

const CATEGORY_ICONS: Record<string, string> = {
  皮肤管理: '✨',
  抗衰光电: '⚡',
  轮廓咨询: '👑',
};

const STATUS_CONFIG = {
  pushed: { label: '已推送', color: 'bg-blue-50 text-blue-600 border border-blue-200', dot: 'bg-blue-500' },
  pending: { label: '待接手', color: 'bg-amber-50 text-amber-600 border border-amber-200', dot: 'bg-amber-500' },
  accepted: { label: '已接手', color: 'bg-green-50 text-green-600 border border-green-200', dot: 'bg-green-500' },
};

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function RecordDetail({ record, onBack, onAccept }: { record: ReceptionRecord; onBack: () => void; onAccept: (id: string) => void }) {
  const { result, questionnaire } = record;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <button
        className="flex items-center gap-2 text-ink-500 hover:text-rose-gold transition-colors mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回列表</span>
      </button>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold to-rose-goldLight flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-serif text-xl text-ink-900">{maskPhone(record.phone)}</div>
              <div className="text-ink-500 text-sm">
                {formatTime(record.pushedAt)} 推送
                {record.acceptedAt && ` · ${formatTime(record.acceptedAt)} 接手`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`tag-chip text-sm ${STATUS_CONFIG[record.status].color}`}>
              {STATUS_CONFIG[record.status].label}
            </span>
            {record.status === 'pending' && (
              <motion.button
                className="btn-primary text-sm px-5 py-2 flex items-center gap-2"
                onClick={() => onAccept(record.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 className="w-4 h-4" />
                接手
              </motion.button>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blush-50 via-blush-100 to-blush-50 rounded-2xl p-6 text-center border-2 border-rose-gold/20 mb-6">
          <div className="text-4xl mb-2">{CATEGORY_ICONS[result.recommendedCategory]}</div>
          <div className="font-serif text-2xl text-rose-goldDark font-semibold mb-1">
            {result.recommendedCategory}
          </div>
          <div className="text-ink-500 text-sm">{result.consultantType}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
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
          <div className="bg-blush-50 rounded-xl p-4 flex items-start gap-3">
            <Heart className="w-4 h-4 text-rose-gold mt-0.5" />
            <div>
              <div className="text-ink-500 text-xs mb-1">痛感耐受</div>
              <div className="text-ink-900 font-medium">{questionnaire.afraidOfPain ? '比较怕痛' : '不怕痛'}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-ink-500 text-xs mb-2">关注部位</div>
          <div className="flex flex-wrap gap-2">
            {questionnaire.concernAreas.map((a) => (
              <span key={a} className="tag-chip bg-blush-100 text-rose-goldDark text-xs">{a}</span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-ink-500 text-xs mb-2">期望改善</div>
          <div className="flex flex-wrap gap-2">
            {questionnaire.expectedEffects.map((e) => (
              <span key={e} className="tag-chip bg-blush-100 text-rose-goldDark text-xs">{e}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-rose-gold" />
          <h3 className="font-serif text-xl text-ink-900">接待标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <span key={tag.id} className={`tag-chip text-sm ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-6 border-l-4 border-l-rose-gold">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquareText className="w-5 h-5 text-rose-gold" />
          <h3 className="font-serif text-xl text-ink-900">优先沟通话术</h3>
        </div>
        <p className="text-ink-700 leading-relaxed bg-blush-50 rounded-xl p-4">
          {result.communicationScript}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-purple-600" />
          <h3 className="font-serif text-xl text-ink-900">推荐项目方向</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {result.recommendedProjects.map((proj, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 font-medium text-sm"
            >
              <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {proj}
            </div>
          ))}
        </div>
      </div>

      {result.avoidPoints.length > 0 && (
        <div className="card p-6 border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-serif text-xl text-ink-900">沟通避坑提示</h3>
          </div>
          <ul className="space-y-2">
            {result.avoidPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-600 text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default function ConsultantView() {
  const { queue, updateRecordStatus, setViewMode } = useAppStore();
  const [filter, setFilter] = useState<CategoryFilter>('全部');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filters: CategoryFilter[] = ['全部', '皮肤管理', '抗衰光电', '轮廓咨询'];

  const filtered = filter === '全部'
    ? queue
    : queue.filter((r) => r.result.recommendedCategory === filter);

  const pendingCount = queue.filter((r) => r.status === 'pending').length;
  const selectedRecord = selectedId ? queue.find((r) => r.id === selectedId) : null;

  const handleAccept = (id: string) => {
    updateRecordStatus(id, 'accepted');
    setSelectedId(null);
  };

  return (
    <div className="w-full min-h-screen py-8 px-8">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ink-900">咨询师工作台</h1>
            <p className="text-ink-500 mt-1">
              待接手 <span className="text-amber-600 font-semibold">{pendingCount}</span> 位求美者
            </p>
          </div>
          <button
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={() => setViewMode('tablet')}
          >
            <ArrowLeft className="w-4 h-4" />
            返回前台
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-ink-500" />
          {filters.map((f) => (
            <button
              key={f}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white shadow-elegant'
                  : 'bg-white text-ink-700 border border-blush-200 hover:border-rose-goldLight'
              }`}
              onClick={() => setFilter(f)}
            >
              {f !== '全部' && <span className="mr-1">{CATEGORY_ICONS[f]}</span>}
              {f}
              {f !== '全部' && (
                <span className="ml-1 text-xs opacity-70">
                  ({queue.filter((r) => r.result.recommendedCategory === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedRecord ? (
            <RecordDetail
              key="detail"
              record={selectedRecord}
              onBack={() => setSelectedId(null)}
              onAccept={handleAccept}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filtered.length === 0 && (
                <div className="card p-12 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-ink-500">当前分类暂无接待记录</p>
                </div>
              )}
              {filtered.map((rec) => {
                const sc = STATUS_CONFIG[rec.status];
                return (
                  <motion.div
                    key={rec.id}
                    className="card p-5 flex items-center gap-5 hover:shadow-elegant transition-all cursor-pointer"
                    onClick={() => setSelectedId(rec.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blush-100 to-blush-200 flex items-center justify-center text-xl">
                      {CATEGORY_ICONS[rec.result.recommendedCategory]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-ink-900 font-medium">{maskPhone(rec.phone)}</span>
                        <span className={`tag-chip text-xs py-0.5 px-2 border ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-ink-500">
                        <span>{rec.result.recommendedCategory}</span>
                        <span>·</span>
                        <span>{formatTime(rec.pushedAt)}</span>
                        <span>·</span>
                        <span>{rec.result.tags.length} 个标签</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {rec.status === 'pending' && (
                        <motion.button
                          className="btn-primary text-sm px-4 py-2 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(rec.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          接手
                        </motion.button>
                      )}
                      <button
                        className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center text-rose-gold hover:bg-blush-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(rec.id);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
