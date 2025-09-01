import questionnaire from "../data/questionnaire.json";

// Option type definition for questionnaire options
type Opt = string | { label: string; value: string; isNone?: boolean };

// Normalize options to consistent object format
function normOptions(opts: Opt[] = []) {
  return opts.map(o => typeof o === 'string' ? { label: o, value: o } : o);
}

// Get question by ID from questionnaire data
function getQuestionById(id: string) {
  return (questionnaire as any).questions.find((q: any) => q.id === id);
}

// Check if a value is considered a "None" option for a given question
function isNoneValueByQid(qid: string, v: string) {
  const q = getQuestionById(qid);
  const opts = normOptions(q?.options);
  const hit = opts.find(o => o.value === v);
  return hit?.isNone === true || v === 'None of the above';
}

// Type definitions for navigation logic
export type AnswerHistory = Record<string, string | string[]>;
type NavigationType = "simple" | "conditional" | "cross-question";

interface SimpleRules {
  [key: string]: string;
}

interface ConditionalRules {
  [key: string]: string;
}

interface CrossQuestionRule {
  [key: string]: any;
  next: string;
}

/**
 * Determine the next question ID based on current question, answer, and answer history
 * @param currentId - Current question ID
 * @param answer - Current question's answer(s)
 * @param answerHistory - History of all previous answers
 * @returns Next question ID or undefined if assessment complete
 */
export function getNextId(
    currentId: string,
    answer: string | string[],
    answerHistory: AnswerHistory
): string | undefined {
  const current = (questionnaire as any).questions.find((q: any) => q.id === currentId);
  if (!current || !current.navigation) return;

  const { type, rules, defaultNext } = current.navigation;

  switch (type as NavigationType) {
    case "simple":
      return getNextBySimpleRules(rules, answer);

    case "conditional":
      if (Array.isArray(answer)) {
        return getNextByConditionalRules(rules, answer, current);
      } else {
        console.warn("Expected array answer for conditional type question:", currentId);
        return;
      }

    case "cross-question":
      return getNextByCrossQuestionRules(rules, answerHistory, defaultNext, currentId, answer);

    default:
      return;
  }
}

/**
 * Handle simple navigation rules (direct answer-to-next mapping)
 */
function getNextBySimpleRules(
    rules: string | SimpleRules,
    answer: string | string[]
): string | undefined {
  if (typeof rules === "string") return rules;
  if (typeof answer === "string") return rules[answer];
  if (Array.isArray(answer)) return rules[answer[0]];
  return;
}

/**
 * Handle conditional navigation rules (based on presence of symptoms)
 */
function getNextByConditionalRules(
    rules: ConditionalRules,
    answer: string[],
    current: any
): string | undefined {
  if (!Array.isArray(answer)) return;

  // Get "none" options for current question
  const opts = normOptions(current?.options);
  const isNone = (v: string) =>
      !!opts.find(o => o.value === v && o.isNone) || v === "None of the above";

  // All answers are "none" options → go to "None of the above" route
  if (answer.length > 0 && answer.every(isNone) && rules["None of the above"]) {
    return rules["None of the above"];
  }

  // At least one non-"none" answer → go to symptom route
  const hasSymptom = answer.some(v => !isNone(v));
  if (hasSymptom && rules["ifAnySymptom"]) {
    return rules["ifAnySymptom"];
  }

  return;
}

/**
 * Handle cross-question navigation rules (complex conditions across multiple questions)
 */
function getNextByCrossQuestionRules(
    rules: CrossQuestionRule[],
    history: AnswerHistory,
    defaultNext?: string,
    currentId?: string,
    answer?: string | string[]
): string | undefined {
  for (const rule of rules) {
    let passed = true;

    for (const [key, expected] of Object.entries(rule)) {
      // Skip navigation control fields
      if (key === "next" || key === "operator" || key === "value") continue;
      
      const [qid, method] = key.split(".");
      const val = (qid === currentId) ? answer : history[qid];

      // Convert value to array for consistent processing
      const toArr = (v: any): string[] =>
          Array.isArray(v) ? v : (v == null ? [] : [v]);

      const arr = toArr(val);
      const expIsNone = String(expected) === "None of the above";

      if (method === "hasAnyExcept") {
        if (!arr.length) { passed = false; continue; }
        if (expIsNone) {
          // Check if at least one answer is not a "none" option
          if (!arr.some(v => !isNoneValueByQid(qid, v))) passed = false;
        } else {
          if (!arr.some(v => v !== expected)) passed = false;
        }
      }

      else if (method === "includesOnly") {
        if (!arr.length) { passed = false; continue; }
        if (expIsNone) {
          // Check if all answers are "none" options
          if (!arr.every(v => isNoneValueByQid(qid, v))) passed = false;
        } else {
          if (!arr.every(v => v === expected)) passed = false;
        }
      }

      else if (method === "countExcept") {
        const op = rule.operator;
        const value = rule.value;
        const count = expIsNone
            ? arr.filter(v => !isNoneValueByQid(qid, v)).length
            : arr.filter(v => v !== expected).length;

        if (
            (op === ">=" && !(count >= value)) ||
            (op === "<=" && !(count <= value)) ||
            (op === "="  &&  count !== value)
        ) {
          passed = false;
        }
      }
    }

    if (passed) return rule.next;
  }
  return defaultNext;
}