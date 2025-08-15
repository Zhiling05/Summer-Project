export interface AssessmentRecommendations {
  primaryRecommendation: string;
  
  // 类别标识，即有这几种label，但UI需前端补充
  recommendationType?: 
      'emergency-department' 
    | 'immediate' 
    | 'urgent-to-oph' 
    | 'urgent-to-gp-or-neur' 
    | 'to-gp'
    | 'no-referral' 
    | 'other-eye-conditions-guidance';
}