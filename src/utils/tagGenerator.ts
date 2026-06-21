import type { QuestionnaireData, ReceptionTag, ReceptionResult } from '../types';

const TAG_COLORS: Record<string, string> = {
  category: 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white',
  preference: 'bg-blush-100 text-rose-goldDark',
  warning: 'bg-red-50 text-red-500 border border-red-200',
  urgency: 'bg-amber-50 text-amber-600 border border-amber-200',
  experience: 'bg-blue-50 text-blue-600 border border-blue-200',
  project: 'bg-purple-50 text-purple-600 border border-purple-200',
};

function createTag(
  id: string,
  label: string,
  type: ReceptionTag['type']
): ReceptionTag {
  return { id, label, type, color: TAG_COLORS[type] };
}

const SKIN_PROJECTS: Record<string, string[]> = {
  low: ['小气泡清洁', '基础补水导入', '舒缓修复面膜'],
  mid: ['光子嫩肤', '水光针基础', '果酸焕肤'],
  high: ['超皮秒祛斑', '黄金微针', '高端水光联合'],
};

const ANTIAGE_PROJECTS: Record<string, string[]> = {
  low: ['射频基础护理', '紧致导入', '抗衰面膜'],
  mid: ['热玛吉眼部', '超声刀局部', '线雕微调'],
  high: ['热玛吉全脸', '超声刀全脸', '线雕提升联合方案'],
};

const CONTOUR_PROJECTS: Record<string, string[]> = {
  low: ['瘦脸针基础', '玻尿酸微调', '埋线提升'],
  mid: ['综合鼻部塑形', '双眼皮成形', '下颌线精雕'],
  high: ['全脸轮廓重塑', '鼻综合手术', '眼鼻联合方案'],
};

function getBudgetTier(budget: string): 'low' | 'mid' | 'high' {
  if (budget === '5000以下' || budget === '5000-1万') return 'low';
  if (budget === '1-3万' || budget === '3-10万') return 'mid';
  return 'high';
}

export function generateReceptionResult(data: QuestionnaireData): ReceptionResult {
  const tags: ReceptionTag[] = [];
  const avoidPoints: string[] = [];
  const recommendedProjects: string[] = [];

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

  if (data.afraidOfPain === true) {
    tags.push(createTag('pain', '痛感敏感', 'warning'));
    avoidPoints.push('避免强调痛感明显的项目，优先推荐无创舒缓项目');
  }

  if (data.dealIntention) {
    if (data.dealIntention === '今天想直接做') {
      tags.push(createTag('deal-high', '高意向', 'urgency'));
    } else if (data.dealIntention === '先了解再决定') {
      tags.push(createTag('deal-mid', '意向一般', 'preference'));
    } else {
      tags.push(createTag('deal-low', '初步了解', 'preference'));
      avoidPoints.push('避免强销售，侧重专业讲解和案例展示');
    }
  }

  if (data.pastExperience) {
    if (data.pastExperience === '从未做过') {
      tags.push(createTag('exp-1', '医美小白', 'experience'));
    } else if (data.pastExperience === '多种都做过') {
      tags.push(createTag('exp-2', '资深求美者', 'experience'));
    } else {
      tags.push(createTag('exp-3', '有医美经验', 'experience'));
    }
  }

  if (data.recoveryAcceptable === '无需恢复期' || data.recoveryAcceptable === '1-3天') {
    tags.push(createTag('recov', '恢复期敏感', 'warning'));
    avoidPoints.push('优先推荐无创或短恢复期项目');
  }

  if (data.visitPurpose) {
    tags.push(createTag('visit', `到店目的：${data.visitPurpose}`, 'preference'));
  }

  data.concernAreas.forEach((area, i) => {
    tags.push(createTag(`area-${i}`, `关注：${area}`, 'preference'));
  });

  const projectMap = {
    皮肤管理: SKIN_PROJECTS,
    抗衰光电: ANTIAGE_PROJECTS,
    轮廓咨询: CONTOUR_PROJECTS,
  };

  const projects = projectMap[recommendedCategory][budgetTier];
  projects.forEach((p, i) => {
    recommendedProjects.push(p);
    tags.push(createTag(`proj-${i}`, `推荐：${p}`, 'project'));
  });

  const isHighIntent = data.dealIntention === '今天想直接做';
  const isLowBudget = budgetTier === 'low';
  const isPainSensitive = data.afraidOfPain === true;
  const isNewbie = data.pastExperience === '从未做过';
  const isRecoverySensitive = data.recoveryAcceptable === '无需恢复期' || data.recoveryAcceptable === '1-3天';

  let communicationScript = '';

  if (isHighIntent && !isLowBudget) {
    communicationScript = '高意向客户，尽快安排面诊并出具个性化方案，可适度介绍高价值项目的效果差异，促成当天决策。';
  } else if (isHighIntent && isLowBudget) {
    communicationScript = '有成交意愿但预算有限，优先推荐高性价比入门项目，让客户先体验建立信任，后续再升级。';
  } else if (isPainSensitive && isNewbie) {
    communicationScript = '医美小白且怕痛，沟通时多介绍无创项目原理，用案例降低心理门槛，避免专业术语轰炸。';
  } else if (isRecoverySensitive && isLowBudget) {
    communicationScript = '恢复期敏感+预算有限，主推基础护理类项目，强调零恢复期和渐进式改善，不推荐手术类。';
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
  };
}
