import questionnaire from "../data/questionnaire.json";


type Opt = string | { label: string; value: string; isNone?: boolean };

function normOptions(opts: Opt[] = []) {
  return opts.map(o => typeof o === 'string' ? { label: o, value: o } : o);
}
function getQuestionById(id: string) {
  return (questionnaire as any).questions.find((q: any) => q.id === id);
}
function isNoneValueByQid(qid: string, v: string) {
  const q = getQuestionById(qid);
  const opts = normOptions(q?.options);
  const hit = opts.find(o => o.value === v);
  return hit?.isNone === true || v === 'None of the above';
}

// 类型定义
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

function getNextBySimpleRules(
    rules: string | SimpleRules,
    answer: string | string[]
): string | undefined {
  if (typeof rules === "string") return rules;
  if (typeof answer === "string") return rules[answer];
  if (Array.isArray(answer)) return rules[answer[0]];
  return;
}

// function getNextByConditionalRules(
//     rules: ConditionalRules,
//     answer: string[]
// ): string | undefined {
//   if (!Array.isArray(answer)) return;
//
//   if (answer.includes("None of the above") && rules["None of the above"]) {
//     return rules["None of the above"];
//   }
//   const hasSymptom = answer.some((opt) => opt !== "None of the above");
//   if (hasSymptom && rules["ifAnySymptom"]) {
//     return rules["ifAnySymptom"];
//   }
//
//   return;
// }
function getNextByConditionalRules(
    rules: ConditionalRules,
    answer: string[],
    current: any
): string | undefined {
  if (!Array.isArray(answer)) return;

  // 当前题的 none 集合
  const opts = normOptions(current?.options);
  const isNone = (v: string) =>
      !!opts.find(o => o.value === v && o.isNone) || v === "None of the above";

  // 全部都是 none → 走 "None of the above"
  if (answer.length > 0 && answer.every(isNone) && rules["None of the above"]) {
    return rules["None of the above"];
  }

  // 只要有一个不是 none → 走 ifAnySymptom
  const hasSymptom = answer.some(v => !isNone(v));
  if (hasSymptom && rules["ifAnySymptom"]) {
    return rules["ifAnySymptom"];
  }

  return;
}


// function getNextByCrossQuestionRules(
//     rules: CrossQuestionRule[],
//     history: AnswerHistory,
//     defaultNext?: string,
//     currentId?: string,
//     answer?: string | string[]
// ): string | undefined {
//   for (const rule of rules) {
//     let passed = true;
//
//     for (const [key, expected] of Object.entries(rule)) {
//       // if (key === "next") continue;
//       // 跳过“下一个目标”、运算符和值字段
//       if (key === "next" || key === "operator" || key === "value") continue;
//
//       const [qid, method] = key.split(".");
//
//       // 当前题目的答案需要从 answer 参数中读取
//       const val = (qid === currentId) ? answer : history[qid];
//
//       if (method === "hasAnyExcept") {
//         if (!Array.isArray(val) || !val.some((v) => v !== expected)) passed = false;
//       }
//
//       else if (method === "includesOnly") {
//         if (!Array.isArray(val) || val.some((v) => v !== expected)) passed = false;
//       }
//
//       else if (method === "countExcept") {
//         const count = Array.isArray(val)
//             ? val.filter((v) => v !== expected).length
//             : 0;
//         const op = rule.operator;
//         const value = rule.value;
//
//         if (
//             (op === ">=" && !(count >= value)) ||
//             (op === "<=" && !(count <= value)) ||
//             (op === "=" && count !== value)
//         ) {
//           passed = false;
//         }
//       }
//
//       // else {
//       //   console.warn(`Unknown method "${method}" in cross-question rule.`);
//       //   passed = false;
//       // }
//     }
//
//     if (passed) return rule.next;
//   }
//
//
//
//   return defaultNext;
// }
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
      if (key === "next" || key === "operator" || key === "value") continue;
      const [qid, method] = key.split(".");
      const val = (qid === currentId) ? answer : history[qid];

      const toArr = (v: any): string[] =>
          Array.isArray(v) ? v : (v == null ? [] : [v]);

      const arr = toArr(val);
      const expIsNone = String(expected) === "None of the above";

      if (method === "hasAnyExcept") {
        if (!arr.length) { passed = false; continue; }
        if (expIsNone) {
          // 有至少一个不是 none
          if (!arr.some(v => !isNoneValueByQid(qid, v))) passed = false;
        } else {
          if (!arr.some(v => v !== expected)) passed = false;
        }
      }

      else if (method === "includesOnly") {
        if (!arr.length) { passed = false; continue; }
        if (expIsNone) {
          // 全都是 none
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
