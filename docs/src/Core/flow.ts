// /* ------------- src/core/flow.ts ------------- */
// import flow from "../data/questionnaire.json";
//
// /** 全局答案，key=题号，value=当前题答案 */
// const answers: Record<string, any> = {};
//
// /** 在组件里调用：保存用户作答 */
// export function recordAnswer(id: string, value: any) {
//   answers[id] = value;
// }
//
// /** 计算下一题 id（只支持 equals / includesAny / includes / includesTwoOrMore / includesExactlyOneOf） */
// export function getNextId(currentId: string, currentValue: any): string | undefined {
//   const entry: any = (flow as any[]).find(e => e.id === currentId);
//   if (!entry) return;
//
//   /* 老式 {next:"Qx"} 或 {next:{Yes:"Q1"}} */
//   if (entry.next) {
//     return typeof entry.next === "string"
//       ? entry.next
//       : entry.next[currentValue];
//   }
//
//   /* 走 rules */
//   for (const r of entry.rules ?? []) {
//     const c = r.if ?? {};
//
//     /* helpers */
//     const incAny  = (arr:string[]) => arr.some(k => currentValue.includes(k));
//     const incAll  = (arr:string[]) => arr.every(k => currentValue.includes(k));
//
//     const ok =
//       (!c.equals) ||
//       (c.equals === currentValue) ||
//
//       (c["Q3.includesAny"] &&
//         incAny(c["Q3.includesAny"]) && (answers["Q3"]||[]).some((k:string)=>c["Q3.includesAny"].includes(k))) ||
//
//       (c["Q4.includes"] &&
//         incAny(c["Q4.includes"])) ||
//
//       (c["Q4.includesTwoOrMore"] &&
//         currentValue.filter((x:string)=>c["Q4.includesTwoOrMore"].includes(x)).length >= 2) ||
//
//       (c["Q4.includesExactlyOneOf"] &&
//         currentValue.filter((x:string)=>c["Q4.includesExactlyOneOf"].includes(x)).length === 1);
//
//     if (ok) return r.next;
//   }
// }

/* ------------- src/core/flow.ts ------------- */
import flow from "../data/questionnaire.json";

/** —— 在这里定义数据结构接口 —— */
interface Question {
  id: string;
  type: string;
  question: string;
  // … 根据你 questionnaire.json 里每个字段继续补充
  navigation?: Record<string, unknown>;
  rules?: Array<{ if?: Record<string, any>; next: string }>;
  next?: string | Record<string, string>;
}

interface Questionnaire {
  questions: Question[];
}

/** 全局答案，key=题号，value=当前题答案 */
const answers: Record<string, any> = {};

/** 在组件里调用：保存用户作答 */
export function recordAnswer(id: string, value: any) {
  answers[id] = value;
}

/** 计算下一题 id（同原逻辑） */
export function getNextId(
    currentId: string,
    currentValue: any
): string | undefined {
  // 先断言 flow 为 Questionnaire，然后访问 .questions
  const data = (flow as Questionnaire).questions;
  const entry = data.find((e) => e.id === currentId);
  if (!entry) return;

  if (entry.next) {
    return typeof entry.next === "string"
        ? entry.next
        : entry.next[currentValue];
  }

  for (const r of entry.rules ?? []) {
    const c = r.if ?? {};
    // … 你的规则判断逻辑保持不变 …
    // if (ok) return r.next;
  }
}

/** 是否已有未完成的评估 */
export function hasProgress(): boolean {
  return Object.keys(answers).length > 0;
}

/** 清空当前评估数据 */
export function resetAssessment(): void {
  Object.keys(answers).forEach((k) => delete answers[k]);
}

/** 找到第一个未答的题目 ID，或返回 undefined */
export function getFirstUnanswered(): string | undefined {
  // 这里同样先把 flow 断言为 Questionnaire
  const dataArray = (flow as Questionnaire).questions;
  for (const q of dataArray) {
    if (!answers[q.id]) {
      return q.id;
    }
  }
  return undefined;
}
