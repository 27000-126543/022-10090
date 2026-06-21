import type { QuestionnaireData, ReceptionTag, ReceptionResult } from '../types';

const TAG_COLORS: Record<string, string> = {
  category: 'bg-gradient-to-r from-rose-gold to-rose-goldLight text-white',
  preference: 'bg-blush-100 text-rose-goldDark',
  warning: 'bg-red-50 text-red-500 border border-red-200',
  urgency: 'bg-amber-50 text-amber-600 border border-amber-200',
  experience: 'bg-blue-50 text-blue-600 border border-blue-200',
};

function createTag(
  id: string,
  label: string,
  type: ReceptionTag['type']
): ReceptionTag {
  return { id, label, type, color: TAG_COLORS[type] };
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

  if (data.budgetRange) {
    let budgetLabel = '中等预算';
    if (data.budgetRange === '5000以下') {
      budgetLabel = '预算有限';
      avoidPoints.push('避免先推高价项目，从入门项目切入');
    } else if (data.budgetRange === '5000-1万' || data.budgetRange === '1-3万') {
      budgetLabel = '中等预算';
    } else if (data.budgetRange === '3-10万') {
      budgetLabel = '预算充足';
    } else if (data.budgetRange === '10万以上') {
      budgetLabel = '高净值客户';
    }
    tags.push(createTag('budget', budgetLabel, 'preference'));
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
    submittedAt: new Date(),
  };
}
