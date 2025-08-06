import { getNextId, AnswerHistory } from '../../utils/NavigationLogic';

describe('NavigationLogic', () => {
  describe('Simple navigation rules', () => {
    it('should navigate from Q1 Yes to Q2', () => {
      const result = getNextId('Q1', 'Yes', {});
      expect(result).toBe('Q2');
    });

    it('should navigate from Q1 No to Q9', () => {
      const result = getNextId('Q1', 'No', {});
      expect(result).toBe('Q9');
    });

    it('should navigate from Q3 to Q4', () => {
      const result = getNextId('Q3', ['None of the above'], {});
      expect(result).toBe('Q4');
    });

    it('should handle string rules', () => {
      const result = getNextId('Q22', 'Yes', {});
      expect(result).toBe('URGENT_TO_OPH');
    });
  });

  describe('Conditional navigation rules', () => {
    it('should route to emergency when any red flag symptom present', () => {
      const redFlagSymptom = ['Impaired level or decreased consciousness'];
      const result = getNextId('Q2', redFlagSymptom, {});
      expect(result).toBe('EMERGENCY_DEPARTMENT');
    });

    it('should route to emergency with multiple red flag symptoms', () => {
      const multipleSymptoms = ['Seizures', 'Stroke-like symptoms'];
      const result = getNextId('Q2', multipleSymptoms, {});
      expect(result).toBe('EMERGENCY_DEPARTMENT');
    });

    it('should continue to Q3 when no red flag symptoms', () => {
      const result = getNextId('Q2', ['None of the above'], {});
      expect(result).toBe('Q3');
    });

    it('should route to immediate referral for papilloedema findings', () => {
      const papilloedemaFindings = ['Cotton wool spots on surface or around optic disc and affecting retina'];
      expect(getNextId('Q15', papilloedemaFindings, {})).toBe('IMMEDIATE');
      expect(getNextId('Q24', papilloedemaFindings, {})).toBe('IMMEDIATE');
      expect(getNextId('Q30', papilloedemaFindings, {})).toBe('IMMEDIATE');
      expect(getNextId('Q36', papilloedemaFindings, {})).toBe('IMMEDIATE');
    });

    it('should continue assessment when no papilloedema', () => {
      expect(getNextId('Q15', ['None of the above'], {})).toBe('Q16');
      expect(getNextId('Q24', ['None of the above'], {})).toBe('Q25');
      expect(getNextId('Q30', ['None of the above'], {})).toBe('Q31');
      expect(getNextId('Q36', ['None of the above'], {})).toBe('Q37');
    });
  });

  describe('Cross-question navigation rules', () => {
    it('should route to Q14 when Q3 has symptoms', () => {
      const history = {
        Q3: ['A substantial change in the characteristics of the patient\' s headache']
      };
      const result = getNextId('Q4', 'Yes', history);
      expect(result).toBe('Q14');
    });

    it('should route to Q14 when Q3 has no symptoms but Q4 has multiple symptoms', () => {
      const history = {
        Q3: ['None of the above']
      };
      const q4Answer = ['Change in personality', 'Headache worst in the morning'];
      const result = getNextId('Q4', q4Answer, history);
      expect(result).toBe('Q14');
    });

    it('should use default next when no cross-question rules match', () => {
      const history = {
        Q3: ['None of the above']
      };
      const result = getNextId('Q4', ['Change in personality'], history);
      expect(result).toBe('Q5');
    });

    it('should handle hasAnyExcept logic', () => {
      const history = {
        Q3: ['symptom1', 'None of the above']
      };
      const result = getNextId('Q4', 'Yes', history);
      expect(result).toBe('Q14');
    });

    it('should handle includesOnly logic', () => {
      const history = {
        Q3: ['None of the above']
      };
      const result = getNextId('Q4', ['symptom1', 'symptom2'], history);
      expect(result).toBe('Q14');
    });

    it('should handle countExcept with >= operator', () => {
      const history = {
        Q3: ['None of the above']
      };
      const q4Answer = ['symptom1', 'symptom2'];
      const result = getNextId('Q4', q4Answer, history);
      expect(result).toBe('Q14');
    });
  });

  describe('Visual symptom pathways', () => {
    it('should handle Q5 TVO routing', () => {
      expect(getNextId('Q5', 'Yes', {})).toBe('Q29');
      expect(getNextId('Q5', 'No', {})).toBe('Q6');
    });

    it('should handle Q6 binocular double vision routing', () => {
      expect(getNextId('Q6', 'Yes', {})).toBe('Q7');
      expect(getNextId('Q6', 'No', {})).toBe('Q23');
    });

    it('should handle Q7 heterophoria routing', () => {
      expect(getNextId('Q7', 'Yes', {})).toBe('Q23');
      expect(getNextId('Q7', 'No', {})).toBe('Q8');
    });

    it('should handle Q8 muscle pattern routing', () => {
      expect(getNextId('Q8', 'Yes', {})).toBe('Q29');
      expect(getNextId('Q8', 'No', {})).toBe('Q23');
    });
  });

  describe('Non-headache pathways', () => {
    it('should handle Q9 TVO in non-headache patients', () => {
      expect(getNextId('Q9', 'Yes', {})).toBe('Q29');
      expect(getNextId('Q9', 'No', {})).toBe('Q10');
    });

    it('should handle Q10-Q12 double vision sequence', () => {
      expect(getNextId('Q10', 'Yes', {})).toBe('Q11');
      expect(getNextId('Q10', 'No', {})).toBe('Q13');
      expect(getNextId('Q11', 'Yes', {})).toBe('Q13');
      expect(getNextId('Q11', 'No', {})).toBe('Q12');
      expect(getNextId('Q12', 'Yes', {})).toBe('Q29');
      expect(getNextId('Q12', 'No', {})).toBe('Q13');
    });

    it('should handle Q13 other visual symptoms', () => {
      expect(getNextId('Q13', 'Yes', {})).toBe('OTHER_EYE_CONDITIONS_GUIDANCE');
      expect(getNextId('Q13', 'No', {})).toBe('Q35');
    });
  });

  describe('Disc examination pathways', () => {
    it('should handle disc elevation questions', () => {
      expect(getNextId('Q14', 'Yes', {})).toBe('Q15');
      expect(getNextId('Q14', 'No', {})).toBe('URGENT_TO_GP_OR_NEUR');
      
      expect(getNextId('Q23', 'Yes', {})).toBe('Q24');
      expect(getNextId('Q23', 'No', {})).toBe('TO_GP');
      
      expect(getNextId('Q29', 'Yes', {})).toBe('Q30');
      expect(getNextId('Q29', 'No', {})).toBe('URGENT_TO_OPH');
      
      expect(getNextId('Q35', 'Yes', {})).toBe('Q36');
      expect(getNextId('Q35', 'No', {})).toBe('NO_REFERRAL');
    });
  });

  describe('Edge cases', () => {
    it('should return undefined for non-existent questions', () => {
      const result = getNextId('Q999', 'Yes', {});
      expect(result).toBeUndefined();
    });

    it('should handle null answer', () => {
      const result = getNextId('Q1', null as any, {});
      expect(result).toBeUndefined();
    });

    it('should handle undefined answer', () => {
      const result = getNextId('Q1', undefined as any, {});
      expect(result).toBeUndefined();
    });

    it('should handle empty answer history', () => {
      const result = getNextId('Q1', 'Yes', {});
      expect(result).toBe('Q2');
    });

    it('should handle null answer history', () => {
      const result = getNextId('Q1', 'Yes', null as any);
      expect(result).toBe('Q2');
    });

    it('should handle question without navigation', () => {
      const result = getNextId('INVALID_QUESTION', 'Yes', {});
      expect(result).toBeUndefined();
    });
  });

  describe('Complete assessment pathways', () => {
    it('should simulate emergency pathway Q1 to Q2 to EMERGENCY_DEPARTMENT', () => {
      let history: AnswerHistory = {};
      
      let result = getNextId('Q1', 'Yes', history);
      expect(result).toBe('Q2');
      history.Q1 = 'Yes';
      
      result = getNextId('Q2', ['Seizures'], history);
      expect(result).toBe('EMERGENCY_DEPARTMENT');
    });

    it('should simulate normal pathway Q1 to Q2 to Q3 to Q4', () => {
      let history: AnswerHistory = {};
      
      let result = getNextId('Q1', 'Yes', history);
      expect(result).toBe('Q2');
      history.Q1 = 'Yes';
      
      result = getNextId('Q2', ['None of the above'], history);
      expect(result).toBe('Q3');
      history.Q2 = ['None of the above'];
      
      result = getNextId('Q3', ['None of the above'], history);
      expect(result).toBe('Q4');
      history.Q3 = ['None of the above'];
      
      result = getNextId('Q4', ['None of the above'], history);
      expect(result).toBe('Q5');
    });

    it('should simulate no-headache pathway Q1 to Q9', () => {
      let result = getNextId('Q1', 'No', {});
      expect(result).toBe('Q9');
      
      result = getNextId('Q9', 'No', { Q1: 'No' });
      expect(result).toBe('Q10');
      
      result = getNextId('Q10', 'No', { Q1: 'No', Q9: 'No' });
      expect(result).toBe('Q13');
    });
  });
});