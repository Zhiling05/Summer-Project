export interface AssessmentRecommendations {
  primaryRecommendation: string;
  
  // 类别标识，即有这几种label，但UI需前端补充
  recommendationType?: 
      'emergency_department' 
    | 'immediate' 
    | 'urgent_to_oph' 
    | 'urgent_to_gp_or_neur' 
    | 'gp'
    | 'no_referral' ;
}