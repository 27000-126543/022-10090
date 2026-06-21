export interface QuestionnaireData {
  phone: string;
  verified: boolean;
  visitPurpose: string;
  concernAreas: string[];
  expectedEffects: string[];
  pastExperience: string;
  recoveryAcceptable: string;
  budgetRange: string;
  afraidOfPain: boolean | null;
  dealIntention: string;
}

export type TagType = 'category' | 'preference' | 'warning' | 'urgency' | 'experience' | 'project';

export interface ReceptionTag {
  id: string;
  label: string;
  type: TagType;
  color: string;
}

export interface ReceptionResult {
  recommendedCategory: '皮肤管理' | '抗衰光电' | '轮廓咨询';
  tags: ReceptionTag[];
  avoidPoints: string[];
  consultantType: string;
  submittedAt: string;
  communicationScript: string;
  recommendedProjects: string[];
}

export type RecordStatus = 'pushed' | 'pending' | 'accepted';

export interface ReceptionRecord {
  id: string;
  phone: string;
  result: ReceptionResult;
  questionnaire: QuestionnaireData;
  status: RecordStatus;
  pushedAt: string;
  acceptedAt?: string;
  acceptedBy?: string;
}

export type StepId = 'welcome' | 'basic' | 'preference' | 'risk' | 'submit' | 'result';
export type ViewMode = 'tablet' | 'consultant';

export const VISIT_PURPOSES = ['首次体验', '定期护理', '项目咨询', '其他'];

export const CONCERN_AREAS = [
  '面部轮廓',
  '眼部',
  '鼻部',
  '皮肤状态',
  '抗衰紧致',
  '体型',
  '其他',
];

export const EXPECTED_EFFECTS = [
  '提亮肤色',
  '去皱紧致',
  '祛痘印',
  '收缩毛孔',
  '瘦脸',
  '隆鼻',
  '双眼皮',
  '其他',
];

export const PAST_EXPERIENCES = [
  '从未做过',
  '光电类',
  '注射类',
  '手术类',
  '多种都做过',
];

export const RECOVERY_OPTIONS = [
  '无需恢复期',
  '1-3天',
  '3-7天',
  '1周以上',
  '无所谓',
];

export const BUDGET_RANGES = [
  '5000以下',
  '5000-1万',
  '1-3万',
  '3-10万',
  '10万以上',
];

export const DEAL_INTENTIONS = [
  '今天想直接做',
  '先了解再决定',
  '只是初步看看',
];
