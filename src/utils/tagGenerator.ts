import type { QuestionnaireData, ReceptionTag, ReceptionResult, ProjectItem } from '../types';

const TAG_COLORS: Record<string, string> = {
  category: 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white',
  preference: 'bg-blush-100 text-rose-goldDark',
  warning: 'bg-red-50 text-red-500 border border-red-200',
  urgency: 'bg-amber-50 text-amber-600 border border-amber-200',
  experience: 'bg-blue-50 text-blue-600 border border-blue-200',
  project: 'bg-purple-50 text-purple-600 border border-purple-200',
  deal: 'bg-rose-500 text-white',
};

function createTag(id: string, label: string, type: ReceptionTag['type'] | 'deal'): ReceptionTag {
  return { id, label, type: type as ReceptionTag['type'], color: TAG_COLORS[type] };
}

const GENTLE_SKIN_PROJECTS: ProjectItem[] = [
  { name: '小气泡深层清洁', priority: 1, reason: '无创零痛感，当天见效' },
  { name: '基础补水导入', priority: 2, reason: '舒缓型，无恢复期' },
  { name: '冷敷舒缓修复', priority: 3, reason: '极低刺激，适合敏感肌' },
];
const MID_SKIN_PROJECTS: ProjectItem[] = [
  { name: '光子嫩肤全模式', priority: 1, reason: '光电入门，痛感低' },
  { name: '水光针基础款', priority: 2, reason: '可敷表麻' },
  { name: '果酸焕肤', priority: 3, reason: '皮肤代谢类，短恢复期' },
];
const HIGH_SKIN_PROJECTS: ProjectItem[] = [
  { name: '超皮秒祛斑联合', priority: 1, reason: '高端光电，一步到位' },
  { name: '黄金微针抗衰', priority: 2, reason: '抗衰+嫩肤双效' },
  { name: '高端水光联合抗衰', priority: 3, reason: '长效维养方案' },
];

const GENTLE_ANTIAGE_PROJECTS: ProjectItem[] = [
  { name: '射频基础紧致护理', priority: 1, reason: '温热感，零痛感' },
  { name: '紧致精华导入', priority: 2, reason: '无创维养' },
  { name: '抗衰面膜密集护理', priority: 3, reason: '舒适型' },
];
const MID_ANTIAGE_PROJECTS: ProjectItem[] = [
  { name: '热玛吉眼周', priority: 1, reason: '紧致即刻见效' },
  { name: '超声刀局部', priority: 2, reason: '精雕塑形' },
  { name: 'PPDO蛋白线微调', priority: 3, reason: '微创，短恢复' },
];
const HIGH_ANTIAGE_PROJECTS: ProjectItem[] = [
  { name: '热玛吉全脸+颈部', priority: 1, reason: '抗衰黄金方案，当场见效' },
  { name: '超声刀全脸提升', priority: 2, reason: '深层SMAS层紧致' },
  { name: '线雕全脸联合方案', priority: 3, reason: '提升+填充双效' },
];

const GENTLE_CONTOUR_PROJECTS: ProjectItem[] = [
  { name: '瘦脸针基础款', priority: 1, reason: '注射类，敷表麻痛感低' },
  { name: '玻尿酸填充微调', priority: 2, reason: '局部精雕，可敷麻' },
  { name: '下颌线埋线微提升', priority: 3, reason: '微创，当天见效' },
];
const MID_CONTOUR_PROJECTS: ProjectItem[] = [
  { name: '鼻部综合塑形', priority: 1, reason: '五官精雕核心' },
  { name: '全切双眼皮成形', priority: 2, reason: '持久效果' },
  { name: '下颌线轮廓精雕', priority: 3, reason: '综合打造' },
];
const HIGH_CONTOUR_PROJECTS: ProjectItem[] = [
  { name: '全脸轮廓综合重塑', priority: 1, reason: '整体五官+脸型方案' },
  { name: '定制鼻综合手术', priority: 2, reason: '肋软骨/假体高端方案' },
  { name: '眼鼻联合全脸打造', priority: 3, reason: '一次到位方案' },
];

function getBudgetTier(budget: string): 'low' | 'mid' | 'high' {
  if (budget === '5000以下' || budget === '5000-1万') return 'low';
  if (budget === '1-3万' || budget === '3-10万') return 'mid';
  return 'high';
}

function getProjects(
  category: ReceptionResult['recommendedCategory'],
  budgetTier: 'low' | 'mid' | 'high',
  gentlePreferred: boolean
): ProjectItem[] {
  let base: ProjectItem[];
  if (gentlePreferred) {
    switch (category) {
      case '皮肤管理': base = GENTLE_SKIN_PROJECTS; break;
      case '抗衰光电': base = GENTLE_ANTIAGE_PROJECTS; break;
      case '轮廓咨询': base = GENTLE_CONTOUR_PROJECTS; break;
    }
  } else {
    const map = {
      皮肤管理: [GENTLE_SKIN_PROJECTS, MID_SKIN_PROJECTS, HIGH_SKIN_PROJECTS],
      抗衰光电: [GENTLE_ANTIAGE_PROJECTS, MID_ANTIAGE_PROJECTS, HIGH_ANTIAGE_PROJECTS],
      轮廓咨询: [GENTLE_CONTOUR_PROJECTS, MID_CONTOUR_PROJECTS, HIGH_CONTOUR_PROJECTS],
    };
    const idx = budgetTier === 'low' ? 0 : budgetTier === 'mid' ? 1 : 2;
    base = map[category][idx];
  }
  return [...base];
}

export function generateReceptionResult(data: QuestionnaireData): ReceptionResult {
  const tags: ReceptionTag[] = [];
  const avoidPoints: string[] = [];

  let skinScore = 0;
  let antiAgeScore = 0;
  let contourScore = 0;

  if (data.concernAreas.includes('皮肤状态')) skinScore += 3;
  if (data.expectedEffects.includes('提亮肤色')) skinScore += 2;
  if (data.expectedEffects.includes('祛痘印')) skinScore += 2;
  if (data.expectedEffects.includes('收缩毛孔')) skinScore += 2;

  if (data.concernAreas.includes('抗衰紧致')) antiAgeScore += 3;
  if (data.expectedEffects.includes('去皱紧致')) antiAgeScore += 3;

  if (data.concernAreas.includes('面部轮廓')) contourScore += 3;
  if (data.concernAreas.includes('眼部')) contourScore += 2;
  if (data.concernAreas.includes('鼻部')) contourScore += 2;
  if (data.expectedEffects.includes('瘦脸')) contourScore += 2;
  if (data.expectedEffects.includes('隆鼻')) contourScore += 2;
  if (data.expectedEffects.includes('双眼皮')) contourScore += 2;

  let recommendedCategory: ReceptionResult['recommendedCategory'];
  if (contourScore >= antiAgeScore && contourScore >= skinScore && contourScore > 0) {
    recommendedCategory = '轮廓咨询';
  } else if (antiAgeScore >= skinScore && antiAgeScore > 0) {
    recommendedCategory = '抗衰光电';
  } else {
    recommendedCategory = '皮肤管理';
  }

  tags.push(createTag('cat-1', recommendedCategory, 'category'));

  const budgetTier = getBudgetTier(data.budgetRange);
  const isLowBudget = budgetTier === 'low';
  const isPainSensitive = data.afraidOfPain === true;
  const isRecoverySensitive = data.recoveryAcceptable === '无需恢复期' || data.recoveryAcceptable === '1-3天';
  const isNewbie = data.pastExperience === '从未做过';
  const isHighIntent = data.dealIntention === '今天想直接做';
  const isHighBudget = budgetTier === 'high';

  const gentlePreferred = isLowBudget && isPainSensitive;

  if (data.budgetRange) {
    if (data.budgetRange === '5000以下') {
      tags.push(createTag('budget', '预算有限', 'preference'));
      avoidPoints.push('避免先推高价项目，从入门项目切入');
    } else if (data.budgetRange === '5000-1万' || data.budgetRange === '1-3万') {
      tags.push(createTag('budget', '中等预算', 'preference'));
    } else if (data.budgetRange === '3-10万') {
      tags.push(createTag('budget', '预算充足', 'preference'));
    } else if (data.budgetRange === '10万以上') {
      tags.push(createTag('budget', '高净值客户', 'preference'));
    }
  }

  if (isPainSensitive) {
    tags.push(createTag('pain', '痛感敏感', 'warning'));
    avoidPoints.push('避免强调痛感明显的项目，优先推荐无创舒缓项目');
  }

  if (data.dealIntention) {
    if (isHighIntent) {
      tags.push(createTag('deal-high', '高意向', 'urgency'));
    } else if (data.dealIntention === '先了解再决定') {
      tags.push(createTag('deal-mid', '意向一般', 'preference'));
    } else {
      tags.push(createTag('deal-low', '初步了解', 'preference'));
      avoidPoints.push('避免强销售，侧重专业讲解和案例展示');
    }
  }

  if (data.pastExperience) {
    if (isNewbie) {
      tags.push(createTag('exp-1', '医美小白', 'experience'));
    } else if (data.pastExperience === '多种都做过') {
      tags.push(createTag('exp-2', '资深求美者', 'experience'));
    } else {
      tags.push(createTag('exp-3', '有医美经验', 'experience'));
    }
  }

  if (isRecoverySensitive) {
    tags.push(createTag('recov', '恢复期敏感', 'warning'));
    avoidPoints.push('优先推荐无创或短恢复期项目');
  }

  if (data.visitPurpose) {
    tags.push(createTag('visit', `到店目的：${data.visitPurpose}`, 'preference'));
  }

  data.concernAreas.forEach((area, i) => {
    tags.push(createTag(`area-${i}`, `关注：${area}`, 'preference'));
  });

  if (gentlePreferred) {
    tags.push(createTag('gentle', '推荐：无创舒缓方案', 'warning'));
  }

  const recommendedProjects = getProjects(recommendedCategory, budgetTier, gentlePreferred);
  const projectNames = recommendedProjects.map((p) => p.name);

  recommendedProjects.forEach((p, i) => {
    const priorityLabel = p.priority === 1 ? '首推' : p.priority === 2 ? '次推' : '备选';
    tags.push(createTag(`proj-${i}`, `${priorityLabel}：${p.name}`, 'project'));
  });

  let communicationScript = '';
  let dealReminder: string | undefined;

  if (isHighIntent && isHighBudget) {
    communicationScript = '今日成交型客户！先安排面诊，快速出具高端联合方案，重点对比高价值和性价比，展示对比效果和案例，用高价值方案对比吸引客户，重点呈现即刻效果和高价值对比的可视化效果，展示高端方案并推动当天下单。';
    dealReminder = '🔥 高意向高预算客户，建议：1.立即安排资深咨询师+主任联合面诊；2.准备高端项目方案书；3.安排VIP接待室；4.备好项目对比资料和案例册；5.预留充足面诊时间；6.准备促销方案并推动当天下单。';
    tags.push(createTag('deal-today', '今日成交高客', 'deal'));
  } else if (isHighIntent && isLowBudget) {
    communicationScript = '今日成交型但预算有限，优先推荐高性价比入门项目，让客户先体验建立信任，后续再升级高价值价值。';
    dealReminder = '💡 高意向低预算客户，建议：尽快安排入门项目体验，先用低门槛建立信任；体验后转化升级；当天成交可推低总价打包款。';
    tags.push(createTag('deal-lowbud', '今日成交(低客单)', 'urgency'));
  } else if (isHighIntent) {
    communicationScript = '今日成交型客户，先安排快速面诊，对比价值和价值价值，聚焦核心价值。';
    dealReminder = '✅ 高意向客户，建议：尽快安排面诊，出具方案并推动当天下单。';
  } else if (gentlePreferred) {
    communicationScript = '低预算+怕痛客户，沟通方式：先以低门槛入门项目切入，重点讲解无创伤性无恢复无 痛感，对比性价比，避免高价值方案。';
  } else if (isPainSensitive && isNewbie) {
    communicationScript = '医美小白且怕痛，沟通时多介绍无创项目原理，用真实案例降低高价值门槛；重点讲解舒适度和价值价值和价值价值价值价值。';
  } else if (isRecoverySensitive && isLowBudget) {
    communicationScript = '恢复期敏感+预算有限，主推基础护理类项目，强调零恢复期和渐进式改善。';
  } else if (isNewbie) {
    communicationScript = '首次接触医美，用通俗语言介绍项目原理和效果，配合真实案例，让客户先建立信任再推进。';
  } else if (data.pastExperience === '多种都做过') {
    communicationScript = '资深求美者，直接切入专业层面，了解过往项目效果和不满意点，精准推荐升级或互补方案。';
  } else {
    communicationScript = '了解客户核心诉求后对症推荐，适度介绍项目亮点，保持专业度同时给予信心。';
  }

  const consultantMap: Record<string, string> = {
    皮肤管理: '皮肤管理咨询师',
    抗衰光电: '抗衰光电咨询师',
    轮廓咨询: '轮廓整形咨询师',
  };

  return {
    recommendedCategory,
    tags,
    avoidPoints,
    consultantType: consultantMap[recommendedCategory],
    submittedAt: new Date().toISOString(),
    communicationScript,
    recommendedProjects,
    projectNames,
    dealReminder,
  };
}
