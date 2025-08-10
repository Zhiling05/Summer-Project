import { 
  validateSingleSelection, 
  validateMultipleSelection, 
  validateByType 
} from '../../../../../utils/ValidationLogic';

describe('ValidationLogic', () => {
  describe('validateSingleSelection', () => {
    describe('Valid Cases', () => {
      it('should pass with exactly one selection', () => {
        const result = validateSingleSelection(['Yes']);
        expect(result).toEqual([]);
      });

      it('should pass with No selection', () => {
        const result = validateSingleSelection(['No']);
        expect(result).toEqual([]);
      });

      it('should pass with any single option', () => {
        expect(validateSingleSelection(['option1'])).toEqual([]);
        expect(validateSingleSelection([''])).toEqual([]);
      });
    });

    describe('Invalid Cases', () => {
      it('should fail when no selection is made', () => {
        const result = validateSingleSelection([]);
        expect(result).toEqual(['You must select an option.']);
      });

      it('should fail when multiple selections are made', () => {
        const result = validateSingleSelection(['Yes', 'No']);
        expect(result).toEqual(['You can select only one option.']);
      });

      it('should fail with more than two selections', () => {
        const result = validateSingleSelection(['A', 'B', 'C']);
        expect(result).toEqual(['You can select only one option.']);
      });
    });

    describe('Edge Cases', () => {
      it('should handle null input', () => {
        const result = validateSingleSelection(null as any);
        expect(result).toEqual(['You must select an option.']);
      });

      it('should handle undefined input', () => {
        const result = validateSingleSelection(undefined as any);
        expect(result).toEqual(['You must select an option.']);
      });
    });
  });

  describe('validateMultipleSelection', () => {
    describe('Valid Cases', () => {
      it('should pass with no selections', () => {
        const result = validateMultipleSelection([]);
        expect(result).toEqual([]);
      });

      it('should pass with single selection', () => {
        const result = validateMultipleSelection(['symptom1']);
        expect(result).toEqual([]);
      });

      it('should pass with multiple selections', () => {
        const result = validateMultipleSelection(['symptom1', 'symptom2']);
        expect(result).toEqual([]);
      });

      it('should pass with None of the above alone', () => {
        const result = validateMultipleSelection(['None of the above']);
        expect(result).toEqual([]);
      });

      it('should pass within maximum limit', () => {
        const result = validateMultipleSelection(['A', 'B'], 3);
        expect(result).toEqual([]);
      });
    });

    describe('Invalid Cases - None of the above exclusivity', () => {
      it('should fail when None of the above is mixed with other options', () => {
        const result = validateMultipleSelection(['symptom1', 'None of the above']);
        expect(result).toEqual(['If you choose "None of the above", you cannot select any other options.']);
      });

      it('should fail with multiple symptoms plus None of the above', () => {
        const result = validateMultipleSelection(['symptom1', 'symptom2', 'None of the above']);
        expect(result).toEqual(['If you choose "None of the above", you cannot select any other options.']);
      });

      it('should handle case sensitivity for None of the above', () => {
        const result = validateMultipleSelection(['symptom1', 'none of the above']);
        expect(result).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      it('should handle undefined max parameter', () => {
        const result = validateMultipleSelection(['A', 'B', 'C']);
        expect(result).toEqual([]);
      });

      it('should handle null selections', () => {
        const result = validateMultipleSelection(null as any);
        expect(result).toEqual([]);
      });

      it('should handle undefined selections', () => {
        const result = validateMultipleSelection(undefined as any);
        expect(result).toEqual([]);
      });
    });
  });

  describe('validateByType', () => {
    describe('Single type routing based on questionnaire.json', () => {
      it('should route single-choice to single validation', () => {
        const result = validateByType('single-choice', ['Yes']);
        expect(result).toEqual([]);
      });

      it('should route single to single validation', () => {
        const result = validateByType('single', ['No']);
        expect(result).toEqual([]);
      });

      it('should handle case insensitive single types', () => {
        expect(validateByType('SINGLE', ['Yes'])).toEqual([]);
        expect(validateByType('Single-Choice', ['No'])).toEqual([]);
      });

      it('should validate single selection errors', () => {
        const result = validateByType('single-choice', []);
        expect(result).toEqual(['You must select an option.']);
      });

      it('should reject multiple selections for single type', () => {
        const result = validateByType('single-choice', ['Yes', 'No']);
        expect(result).toEqual(['You can select only one option.']);
      });
    });

    describe('Multiple type routing based on questionnaire.json', () => {
      it('should route multiple-choice to multiple validation', () => {
        const result = validateByType('multiple-choice', ['symptom1']);
        expect(result).toEqual([]);
      });

      it('should route multi to multiple validation', () => {
        const result = validateByType('multi', ['symptom1', 'symptom2']);
        expect(result).toEqual([]);
      });

      it('should handle case insensitive multiple types', () => {
        expect(validateByType('MULTIPLE-CHOICE', ['symptom1'])).toEqual([]);
        expect(validateByType('Multi', ['symptom1'])).toEqual([]);
      });

      it('should validate None of the above exclusivity', () => {
        const result = validateByType('multiple-choice', ['symptom1', 'None of the above']);
        expect(result).toEqual(['If you choose "None of the above", you cannot select any other options.']);
      });

      it('should allow empty selections for multiple type', () => {
        const result = validateByType('multiple-choice', []);
        expect(result).toEqual([]);
      });
    });

    describe('Default behavior', () => {
      it('should default to single validation for unknown types', () => {
        const result = validateByType('unknown', []);
        expect(result).toEqual(['You must select an option.']);
      });

      it('should default to single validation for empty type', () => {
        const result = validateByType('', []);
        expect(result).toEqual(['You must select an option.']);
      });

      it('should default to single validation for null type', () => {
        const result = validateByType(null as any, ['Yes']);
        expect(result).toEqual([]);
      });
    });

    describe('Options count parameter', () => {
      it('should pass options count to multiple validation', () => {
        const result = validateByType('multiple-choice', ['A', 'B', 'C'], 2);
        expect(result).toEqual(['You can select at most 2 options.']);
      });

      it('should ignore options count for single validation', () => {
        const result = validateByType('single-choice', ['Yes'], 5);
        expect(result).toEqual([]);
      });
    });
  });
});