// // src/tests/unit_tests/types/recommendations.test-d.ts

// import { expectType } from 'tsd';
// import { AssessmentRecommendations } from '../../../types/recommendation';

// /**
//  * 验证 AssessmentRecommendations 接口各字段类型
//  */

// // primaryRecommendation 必须是 string
// expectType<AssessmentRecommendations['primaryRecommendation']>('Refer to GP for follow-up');

// // recommendationType 是可选的、且只能是指定的几种字面量之一
// expectType<AssessmentRecommendations['recommendationType']>('emergency-department');
// expectType<AssessmentRecommendations['recommendationType']>('immediate');
// expectType<AssessmentRecommendations['recommendationType']>('urgent-to-oph');
// expectType<AssessmentRecommendations['recommendationType']>('urgent-to-gp-or-neur');
// expectType<AssessmentRecommendations['recommendationType']>('to-gp');
// expectType<AssessmentRecommendations['recommendationType']>('no-referral');

// // 还验证整个对象类型（可选字段可省略）
// expectType<AssessmentRecommendations>({
//   primaryRecommendation: 'Send patient immediately to emergency department',
//   recommendationType: 'emergency-department',
// });

// expectType<AssessmentRecommendations>({
//   primaryRecommendation: 'No referral needed at this time',
//   // recommendationType 可不提供
// });

// src/tests/unit_tests/types/recommendations.test-d.ts

import { expectType } from 'tsd';
import { AssessmentRecommendations } from '../../../types/recommendation';

// 构造一个最小且合法的 AssessmentRecommendations 对象
const rec: AssessmentRecommendations = {
  primaryRecommendation: 'Refer to GP',
  recommendationType: 'urgent-to-gp-or-neur',
};

expectType<AssessmentRecommendations>(rec);

