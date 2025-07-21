/**
 * 校验单选题：只能选择一个选项
 * @param selections 当前已选项数组
 * @returns 错误信息数组（无错误时返回空数组）
 */
export function validateSingleSelection(
    selections: string[]
  ): string[] {
    const errors: string[] = [];
  
    if (!selections || selections.length === 0) {
      //errors.push('必须选择一个选项。');
      errors.push('You must select an option.');
    } else if (selections.length > 1) {
      //errors.push('只能选择一个选项。');
      errors.push('You can select only one option.');
    }
  
    return errors;
  }
  
  /**
   * 校验多选题：允许选择任意数量的选项，无最低限制；可选地限制最大值
   * 同时，当选项中包含 “None of the above” 时，该项与其他选项互斥
   * @param selections 当前已选项数组
   * @param max 最多选择数，可选
   * @returns 错误信息数组（无错误时返回空数组）
   */
  export function validateMultipleSelection(
    selections: string[],
    max?: number
  ): string[] {
    const errors: string[] = [];
  
    // 互斥校验：如果选择了 “None of the above”，则不能再选其他
    const noneLabel = 'None of the above';
    if (selections.includes(noneLabel) && selections.length > 1) {
      //errors.push(`如果选择 “${noneLabel}”，则不能选择其他选项。`);
      errors.push(`If you choose "${noneLabel}", you cannot select any other options.`);
    }
    // 可选的最大数量限制
    if (typeof max === 'number' && selections.length > max) {
      //errors.push(`最多只能选择 ${max} 项。`);
      errors.push(`You can select at most ${max} options.`);
    }
  
    return errors;
  }
  
  /**
   * 通用入口：根据题目类型调用不同的校验，支持多种 type 格式
   * @param type 题目类型（如 'single', 'single-choice', 'multi', 'multiple-choice'）
   * @param selections 当前已选项数组
   * @param optionsCount （多选题）最大选项数
   * @returns 错误信息数组
   */
  export function validateByType(
    type: string,
    selections: string[],
    optionsCount?: number
  ): string[] {
    const t = type.toLowerCase();
    if (t.startsWith('single')) {
      return validateSingleSelection(selections);
    }
    if (t.startsWith('multi')) {
      return validateMultipleSelection(selections, optionsCount);
    }
    // 默认按单选处理
    return validateSingleSelection(selections);
  }
  