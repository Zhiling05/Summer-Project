import questionnaire from "../data/questionnaire.json";

const { questions } = questionnaire as { questions: any[] };

/** Interface for a single question */
interface Question {
  id: string;
  type: string;
  question: string;
  navigation?: Record<string, unknown>;
  rules?: Array<{ if?: Record<string, any>; next: string }>;
  next?: string | Record<string, string>;
  meta?: { symptomOnYes?: string };
}

interface Questionnaire {
  questions: Question[];
}

/** Global in-memory answers, key = question ID */
const answers: Record<string, any> = {};

/** Save user's answer */
export function recordAnswer(id: string, value: any) {
  answers[id] = value;
}

/** Determine the next question ID based on current answer */
export function getNextId(
  currentId: string,
  currentValue: any
): string | undefined {
  const entry = questions.find((e) => e.id === currentId);
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

/** Check if there is any unfinished progress */
export function hasProgress(): boolean {
  return Object.keys(answers).length > 0;
}

/** Reset all stored answers */
export function resetAssessment(): void {
  Object.keys(answers).forEach((k) => delete answers[k]);
}

/** Get the first unanswered question ID, or undefined if all are answered */
export function getFirstUnanswered(): string | undefined {
  const dataArray = (questionnaire as Questionnaire).questions;
  for (const q of dataArray) {
    if (!answers[q.id]) return q.id;
  }
  return undefined;
}
