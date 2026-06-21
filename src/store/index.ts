import { create } from 'zustand';
import type { QuestionnaireData, ReceptionResult, ReceptionRecord, RecordStatus, StepId, ViewMode } from '../types';

const QUEUE_STORAGE_KEY = 'reception_queue';

function loadQueue(): ReceptionRecord[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: ReceptionRecord[]) {
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

interface AppState {
  currentStep: StepId;
  questionnaire: QuestionnaireData;
  result: ReceptionResult | null;
  viewMode: ViewMode;
  queue: ReceptionRecord[];
  setStep: (step: StepId) => void;
  updateQuestionnaire: (data: Partial<QuestionnaireData>) => void;
  setResult: (result: ReceptionResult | null) => void;
  setViewMode: (mode: ViewMode) => void;
  pushToQueue: (record: ReceptionRecord) => void;
  updateRecordStatus: (id: string, status: RecordStatus, acceptedBy?: string) => void;
  resetForm: () => void;
}

const initialQuestionnaire: QuestionnaireData = {
  phone: '',
  verified: false,
  visitPurpose: '',
  concernAreas: [],
  expectedEffects: [],
  pastExperience: '',
  recoveryAcceptable: '',
  budgetRange: '',
  afraidOfPain: null,
  dealIntention: '',
};

export const useAppStore = create<AppState>((set, get) => ({
  currentStep: 'welcome',
  questionnaire: initialQuestionnaire,
  result: null,
  viewMode: 'tablet',
  queue: loadQueue(),

  setStep: (step) => set({ currentStep: step }),

  updateQuestionnaire: (data) =>
    set((state) => ({
      questionnaire: { ...state.questionnaire, ...data },
    })),

  setResult: (result) => set({ result }),

  setViewMode: (mode) => set({ viewMode: mode }),

  pushToQueue: (record) => {
    const queue = [record, ...get().queue];
    saveQueue(queue);
    set({ queue });
  },

  updateRecordStatus: (id, status, acceptedBy) => {
    const queue = get().queue.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            acceptedAt: status === 'accepted' ? new Date().toISOString() : r.acceptedAt,
            acceptedBy: status === 'accepted' ? (acceptedBy || '咨询师') : r.acceptedBy,
          }
        : r
    );
    saveQueue(queue);
    set({ queue });
  },

  resetForm: () =>
    set({
      currentStep: 'welcome',
      questionnaire: initialQuestionnaire,
      result: null,
    }),
}));
