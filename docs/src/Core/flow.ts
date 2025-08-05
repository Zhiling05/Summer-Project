import questionnaire from "../data/questionnaire.json";

/** 这里直接解构出数组 */
const { questions } = questionnaire as { questions: any[] };

/** —— 在这里定义数据结构接口 —— */
interface Question {
  id: string;
  type: string;
  question: string;
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
  const entry = questions.find(e => e.id === currentId);
  if (!entry) return;

  if (entry.next) {
    return typeof entry.next === "string"
        ? entry.next
        : entry.next[currentValue];

  }

  for (const r of entry.rules ?? []) {
    const c = r.if ?? {};
    let ok = true;

    for (const key in c) {
      const value = c[key];
      if (key === "equals") {
        ok = currentValue === value;
      } else if (key.endsWith(".includesAny")) {
        ok = value.some((v: string) => currentValue.includes(v));
      } else if (key.endsWith(".includesTwoOrMore")) {
        ok = currentValue.filter((v: string) => value.includes(v)).length >= 2;
      } else if (key.endsWith(".includesExactlyOneOf")) {
        ok = currentValue.filter((v: string) => value.includes(v)).length === 1;
      }

      if (!ok) break;
    }

    if (ok) return r.next;
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
  // // 这里同样先把 flow 断言为 Questionnaire
  // const dataArray = (flow as Questionnaire).questions;
  // for (const q of dataArray) {
  //   if (!answers[q.id]) {
  //     return q.id;
  //   }
  // }
  for (const q of questions) {
    if (!answers[q.id]) {
      return q.id;
    }
  }
  return undefined;
}
