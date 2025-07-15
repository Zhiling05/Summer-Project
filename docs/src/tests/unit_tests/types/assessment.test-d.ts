// // src/tests/unit_tests/types/assessment.test-d.ts

// import { expectType } from 'tsd';
// import { AssessmentAnswers } from '../../../types/assessment';

// /**
//  * 验证 AssessmentAnswers 中的各字段类型
//  */

// // 验证最简单的布尔字段 hasHeadache
// expectType<AssessmentAnswers['hasHeadache']>(true);

// // 验证另一个布尔字段 hasNewOnsetTVO
// expectType<AssessmentAnswers['hasNewOnsetTVO']>(false);

// // 验证 Q1 子对象 hasImmediateRedFlag 的结构
// expectType<AssessmentAnswers['hasImmediateRedFlag']>({
//   impairedConsciousness: false,
//   seizures: false,
//   strokeLikeSymptoms: false,
//   thunderclapHeadache: false,
//   newOnsetHeadacheVomiting: false,
//   newOnsetNeurologicalDeficit: false,
//   worseningHeadacheFever: false,
//   noneOfImmediate: true,
// });

// // 验证子对象 hasOptometricCausesOfHeadacheSymptoms 的结构
// expectType<AssessmentAnswers['hasOptometricCausesOfHeadacheSymptoms']>({
//   heterophoriaWithFrontalHeadache: false,
//   headacheWorsenAfterVisualTasks: false,
//   uncorrectedRefractiveError: false,
//   noneOfAdditionalHeadache: true,
// });

// src/tests/unit_tests/types/assessment.test-d.ts

import { expectType } from 'tsd';
import { AssessmentAnswers } from '../../../types/assessment';

// 构造一个最小且合法的 AssessmentAnswers 对象
const sample: AssessmentAnswers = {
  hasHeadache: true,

  hasImmediateRedFlag: {
    impairedConsciousness: false,
    seizures: false,
    strokeLikeSymptoms: false,
    thunderclapHeadache: false,
    newOnsetHeadacheVomiting: false,
    newOnsetNeurologicalDeficit: false,
    worseningHeadacheFever: false,
    noneOfImmediate: true,
  },

  hasUrgentRedFlag: {
    substantialHeadacheChange: false,
    sleepWakingHeadache: false,
    newHeadacheWithMalignancy: false,
    progressivelyWorseningHeadache: false,
    newCognitiveDysfunction: false,
    behavioralChangeInChildren: false,
    coordinationChangeInChildren: false,
    noneOfUrgent: true,
  },

  hasAdditionalUrgent: {
    personalityChange: false,
    morningWorstHeadache: false,
    pulsatileTinnitus: false,
    newHeadacheImmunocompromised: false,
    noneOfAdditionalUrgent: true,
  },

  hasNewOnsetTVO: false,
  hasNewOnsetBDV: false,
  hasHeterophoria: false,
  hasPersistentBDV: false,
  hasIncreasingImageSeparation: false,

  hasOptometricCausesOfHeadacheSymptoms: {
    heterophoriaWithFrontalHeadache: false,
    headacheWorsenAfterVisualTasks: false,
    uncorrectedRefractiveError: false,
    noneOfAdditionalHeadache: true,
  },

  hasNormalDiscs: false,

  hasPPConfirmingSymptoms: {
    cottonWoolSpots: false,
    flameOrBlotHaemorrhages: false,
    noneOfConfirmingSymptoms: true,
  },

  hasPPAdditionalConfirmingSymptoms: {
    obscurationOfVessels: false,
    hyperaemiaOfVessels: false,
    retinalFolds: false,
    choroidalFolds: false,
    noneOfAdditionalConfirmingSymptoms: true,
  },

  hasWhiteYellowBodies: false,
  hasSuspectedPHOMS: false,
  hasPHOMSConfirmedByOCT: false,
  hasCrowdedOrTiltedDiscs: false,
  hasChangeInAcuityOrFields: false,
  isDistinctWhiteYellowBodies: false,
  hasOptometricCausesOfOtherVisualSymptoms: false,
};

expectType<AssessmentAnswers>(sample);

