export interface AssessmentRecommendations {
  primaryRecommendation: string;
  
  // 类别标识，即有这几种label,和路径文件里的path名相同
  recommendationType?: 
      'emergencyDepartment' 
    | 'immediate' 
    | 'urgentToOph' 
    | 'urgentToGpOrNeur' 
    | 'toGp'
    | 'noReferral' ;
}