import { create } from 'zustand';
import type { QuestionnaireData, ReceptionResult, StepId } from '../types';

interface AppState {
  currentStep: StepId;
  questionnaire: QuestionnaireData;
  result: ReceptionResult | null;
  setStep: (step: StepId) => void;
  updateQuestionnaire: (data: Partial<QuestionnaireData>) => void;
  setResult: (result: ReceptionResult | null) => void;
  reset: () => void;
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

export const useAppStore = create<AppState>((set) => ({
  currentStep: 'welcome',
  questionnaire: initialQuestionnaire,
  result: null,
  setStep: (step) => set({ currentStep: step }),
  updateQuestionnaire: (data) =>
    set((state) => ({
      questionnaire: { ...state.questionnaire, ...data },
    })),
  setResult: (result) => set({ result }),
  reset: () =>
    set({
      currentStep: 'welcome',
      questionnaire: initialQuestionnaire,
      result: null,
    }),
}));
