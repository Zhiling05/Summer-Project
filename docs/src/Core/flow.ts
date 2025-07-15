/* ------------- src/core/flow.ts ------------- */
import flow from "../data/questionnaire.json";

/** 全局答案，key=题号，value=当前题答案 */
const answers: Record<string, any> = {};

/** 在组件里调用：保存用户作答 */
export function recordAnswer(id: string, value: any) {
  answers[id] = value;
}

/** 计算下一题 id（只支持 equals / includesAny / includes / includesTwoOrMore / includesExactlyOneOf） */
export function getNextId(currentId: string, currentValue: any): string | undefined {
  const entry: any = (flow as any[]).find(e => e.id === currentId);
  if (!entry) return;

  /* 老式 {next:"Qx"} 或 {next:{Yes:"Q1"}} */
  if (entry.next) {
    return typeof entry.next === "string"
      ? entry.next
      : entry.next[currentValue];
  }

  /* 走 rules */
  for (const r of entry.rules ?? []) {
    const c = r.if ?? {};

    /* helpers */
    const incAny  = (arr:string[]) => arr.some(k => currentValue.includes(k));
    const incAll  = (arr:string[]) => arr.every(k => currentValue.includes(k));

    const ok =
      (!c.equals) ||
      (c.equals === currentValue) ||

      (c["Q3.includesAny"] &&
        incAny(c["Q3.includesAny"]) && (answers["Q3"]||[]).some((k:string)=>c["Q3.includesAny"].includes(k))) ||

      (c["Q4.includes"] &&
        incAny(c["Q4.includes"])) ||

      (c["Q4.includesTwoOrMore"] &&
        currentValue.filter((x:string)=>c["Q4.includesTwoOrMore"].includes(x)).length >= 2) ||

      (c["Q4.includesExactlyOneOf"] &&
        currentValue.filter((x:string)=>c["Q4.includesExactlyOneOf"].includes(x)).length === 1);

    if (ok) return r.next;
  }
}
