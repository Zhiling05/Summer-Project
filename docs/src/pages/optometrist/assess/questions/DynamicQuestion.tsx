/* docs/src/pages/optometrist/assess/questions/DynamicQuestion.tsx */
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";
import BottomNav from "../../../../components/BottomNav";

import questionnaire from "../../../../data/questionnaire.json";
import { getNextId } from "../../../../utils/NavigationLogic.ts";

/* ---------- 类型声明 ---------- */
type QuestionType = "single" | "multi";
type RawOption = string | { label: string; value: string };

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: RawOption[];
  next: string | Record<string, string>;
  hint?: string;
}

const normalize = (opt: RawOption): { label: string; value: string } =>
  typeof opt === "string" ? { label: opt, value: opt } : opt;

const DynamicQuestion = () => {
  /* ——— 路由 & 参数 ——— */
  const { questionId = "" } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  /* ——— 当前题目 ——— */
  const currentQuestion = useMemo<Question | undefined>(
    () => (questionnaire as Question[]).find((q) => q.id === questionId),
    [questionId]
  );

  /* ——— 答案状态 ——— */
  const [singleAns, setSingleAns] = useState("");
  const [multiAns, setMultiAns] = useState<string[]>([]);

  /* 题目切换时重置答案 */
  useEffect(() => {
    setSingleAns("");
    setMultiAns([]);
  }, [questionId]);

  /* 已作答？ */
  const answered =
    currentQuestion?.type === "single"
      ? singleAns !== ""
      : multiAns.length > 0;

  /* 多选切换 */
  const toggle = (val: string) =>
    setMultiAns((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  /* 跳转下一步 */
  const handleNext = () => {
    if (!currentQuestion) return;

    const answerPayload =
      currentQuestion.type === "single" ? singleAns : multiAns;

    /* ① 让 NavigationLogic 判断（若有更复杂逻辑） */
    let nextId = getNextId?.(currentQuestion.id, answerPayload);

    /* ② fallback：按题目自身 next 字段 */
    if (!nextId) {
      if (typeof currentQuestion.next === "string") {
        nextId = currentQuestion.next;
      } else if (currentQuestion.type === "single") {
        nextId = currentQuestion.next[singleAns];
      } else {
        /* 多选：若任一选项匹配映射键就用；否则用 default 或第一个值 */
        const nextMap = currentQuestion.next as Record<string, string>;
        const matched = multiAns.find((a) => (a in nextMap));
        nextId =
          (matched && nextMap[matched]) ||
          nextMap["default"] ||
          Object.values(nextMap)[0];
      }
    }

    if (!nextId) return; // 配置错误

    const path = nextId.startsWith("Q")
      ? `/optometrist/assess/questions/${nextId}`
      : `/optometrist/assess/${nextId}`;
    navigate(path);
  };

  /* ——— 题目不存在 —— */
  if (!currentQuestion)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Question not found: {questionId}</h2>
      </div>
    );
  /* ---------------------------------------------------------------
 *  题目存在，但缺少 question / options 配置
 * ------------------------------------------------------------- */
if (
  (!currentQuestion.question || currentQuestion.question.trim() === "") ||
  !currentQuestion.options ||
  currentQuestion.options.length === 0
) {
  return (
    <>
      {/* —— 顶栏 —— */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      {/* —— 主体 —— */}
      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          <section className="question-box">
            <h1 className="nhsuk-heading-l">⚠️ 题目未配置</h1>
            <p className="hint">
              后台没有为 <strong>{currentQuestion.id}</strong> 配置完整内容。
            </p>
            <button className="continue-button" onClick={handleNext}>
              跳过
            </button>
          </section>
        </main>
      </div>

      <BottomNav />
    </>
  );
}

  /* ——— 渲染 —— */
  const opts = currentQuestion.options.map(normalize);

  return (
    <>
      {/* 顶栏 */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      {/* 主体 */}
      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">{currentQuestion.question}</h1>
            {currentQuestion.hint && <p className="hint">{currentQuestion.hint}</p>}

            <ul className="radio-list">
              {opts.map((o) => {
                const checked =
                  currentQuestion.type === "single"
                    ? singleAns === o.value
                    : multiAns.includes(o.value);

                return (
                  <li key={o.value}>
                    <label className="radio-label">
                      <input
                        type={currentQuestion.type === "single" ? "radio" : "checkbox"}
                        name={currentQuestion.id}
                        value={o.value}
                        checked={checked}
                        onChange={() =>
                          currentQuestion.type === "single"
                            ? setSingleAns(o.value)
                            : toggle(o.value)
                        }
                      />
                      {o.label}
                    </label>
                  </li>
                );
              })}
            </ul>

            <button
              className="continue-button"
              disabled={!answered}
              onClick={handleNext}
            >
              Next
            </button>
          </section>
        </main>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </>
  );
};

export default DynamicQuestion;
