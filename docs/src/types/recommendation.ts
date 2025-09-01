export interface AssessmentRecommendations {
  primaryRecommendation: string;
  recommendationType?: 
      'emergency-department' 
    | 'immediate' 
    | 'urgent-to-oph' 
    | 'urgent-to-gp-or-neur' 
    | 'to-gp'
    | 'no-referral' 
    | 'other-eye-conditions-guidance';
}