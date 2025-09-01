export type QuestionType = "single" | "multi";
export type NavigationType = "simple" | "conditional" | "cross-question";
export type RawOption = string | { label: string; value: string };

export interface QuestionNavigation {
  type: NavigationType;
  rules:
    | Record<string, string> 
    | ({ [k: string]: any; next: string; operator?: string; value?: number })[]; 
  defaultNext?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: RawOption[];
  hint?: string;
  navigation?: QuestionNavigation;
}


export interface AssessmentAnswers {
  // Starting question: Does the patient have a headache?
  hasHeadache: boolean;
  
  // Q1: Immediate Referral red flag symptoms
  hasImmediateRedFlag: {
    impairedConsciousness: boolean;
    seizures: boolean;
    strokeLikeSymptoms: boolean;
    thunderclapHeadache: boolean;
    newOnsetHeadacheVomiting: boolean;
    newOnsetNeurologicalDeficit: boolean;
    worseningHeadacheFever: boolean;
    noneOfImmediate: boolean;
  };
  
  // Q2: Urgent referral red flag symptoms
  hasUrgentRedFlag: {
    substantialHeadacheChange: boolean;
    sleepWakingHeadache: boolean;
    newHeadacheWithMalignancy: boolean;
    progressivelyWorseningHeadache: boolean;
    newCognitiveDysfunction: boolean;
    behavioralChangeInChildren: boolean;
    coordinationChangeInChildren: boolean;
    noneOfUrgent: boolean;
  }

  // Q3: Additional symptoms for urgent referral
  hasAdditionalUrgent: {
    personalityChange: boolean;
    morningWorstHeadache: boolean;
    pulsatileTinnitus: boolean;
    newHeadacheImmunocompromised: boolean;
    noneOfAdditionalUrgent: boolean;
  }

  // Q4
  hasNewOnsetTVO: boolean;
  // Q5
  hasNewOnsetBDV: boolean;    // BDV - binocular double vision
  // Q6
  hasHeterophoria: boolean;
  // Q7
  hasPersistentBDV: boolean;  // BDV - binocular double vision
  // Q8
  hasIncreasingImageSeparation: boolean;
  // Q9
  hasOptometricCausesOfHeadacheSymptoms: {
    heterophoriaWithFrontalHeadache: boolean;
    headacheWorsenAfterVisualTasks: boolean;
    uncorrectedRefractiveError: boolean;
    noneOfAdditionalHeadache: boolean;
  }

  // Q10
  hasNormalDiscs: boolean;
  // Q11
  hasPPConfirmingSymptoms: {       // PP - papilloedema
    cottonWoolSpots: boolean; 
    flameOrBlotHaemorrhages: boolean;
    noneOfConfirmingSymptoms: boolean;
  }
  // Q12
  hasPPAdditionalConfirmingSymptoms: {
    obscurationOfVessels: boolean; 
    hyperaemiaOfVessels: boolean;
    retinalFolds: boolean;
    choroidalFolds: boolean;
    noneOfAdditionalConfirmingSymptoms: boolean;
  }
  // Q13
  hasWhiteYellowBodies: boolean;
  // Q14
  hasSuspectedPHOMS: boolean;
  // Q15
  hasPHOMSConfirmedByOCT: boolean;
  // Q16
  hasCrowdedOrTiltedDiscs: boolean;
  // Q17
  hasChangeInAcuityOrFields: boolean;
  // Q18
  isDistinctWhiteYellowBodies: boolean;

  // Q19
  hasOptometricCausesOfOtherVisualSymptoms: boolean;
}