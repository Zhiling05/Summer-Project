/**
 * Validate single selection questions: only one option can be selected
 * @param selections Array of currently selected options
 * @returns Array of error messages (empty if no errors)
 */
export function validateSingleSelection(
    selections: string[]
  ): string[] {
    const errors: string[] = [];

    // Defensive check to prevent null/undefined causing .length errors
    if (!Array.isArray(selections)) {
      selections = [];
    }
  
    if (!selections || selections.length === 0) {
      errors.push('You must select an option.');
    } else if (selections.length > 1) {
      errors.push('You can select only one option.');
    }
  
    return errors;
  }
  
  /**
   * Validate multiple selection questions: allows selecting any number of options with optional max limit
   * Also handles mutual exclusion when "None of the above" is selected
   * @param selections Array of currently selected options
   * @param max Optional maximum number of selections allowed
   * @returns Array of error messages (empty if no errors)
   */
  export function validateMultipleSelection(
    selections: string[],
    max?: number
  ): string[] {
    const errors: string[] = [];

    // Defensive check to ensure selections is an array, preventing includes() errors
    if (!Array.isArray(selections)) {
      selections = [];
    }
  
    // Mutual exclusion validation: "None of the above" cannot be selected with other options
    const noneLabel = 'None of the above';
    if (selections.includes(noneLabel) && selections.length > 1) {
      errors.push(`If you choose "${noneLabel}", you cannot select any other options.`);
    }
    
    // Optional maximum count validation
    if (typeof max === 'number' && selections.length > max) {
      errors.push(`You can select at most ${max} options.`);
    }
  
    return errors;
  }
  
  /**
   * Generic validation entry point: dispatches to appropriate validation based on question type
   * Supports various type formats for flexibility
   * @param type Question type (e.g., 'single', 'single-choice', 'multi', 'multiple-choice')
   * @param selections Array of currently selected options
   * @param optionsCount Maximum number of options available (for multiple choice questions)
   * @returns Array of error messages
   */
  export function validateByType(
    type: string,
    selections: string[],
    optionsCount?: number
  ): string[] {

    // Defensive check to prevent null type causing .toLowerCase() errors
    const t = (type || '').toLowerCase();

    // Defensive check to ensure selections is an array for consistent handling
    if (!Array.isArray(selections)) {
      selections = [];
    }

    if (t.startsWith('single')) {
      return validateSingleSelection(selections);
    }
    if (t.startsWith('multi')) {
      return validateMultipleSelection(selections, optionsCount);
    }
    
    // Default to single selection validation
    return validateSingleSelection(selections);
  }