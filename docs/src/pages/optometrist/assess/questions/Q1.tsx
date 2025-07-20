// docs/src/pages/optometrist/assess/questions/Q1.tsx
import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../../styles/question.css";
import BottomNav from "../../../../components/BottomNav";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";
import { Answer } from "../../../../api";          // ← 仅用于类型

type FlowEntry =
  | { id: string; next: string }
  | { id: string; next: Record<string, string> };

/* ―――― 额外：本页收到 / 传出的 state 类型 ―――― */
interface LocationState {
  answers?: Answer[];
  patientId?: string;
}

const Q1 = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };

  /* ───── 继承上一题带来的 answers / patientId ───── */
  const prevAnswers = state?.answers ?? [];
  const patientId   = state?.patientId ?? `pid-${Date.now().toString(36)}`;

  const [answer, setAnswer] = useState("");

  /* ---------- Q1 文案 ---------- */
  const question = "Does the patient have a headache?";
  const opts = ["Yes", "No"];

  /* ---------- 从跳转表取 Q1 记录 ---------- */
  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q1"),
    []
  );

  /* ---------- 跳转 ---------- */
  const handleNext = () => {
    if (!answer || !flowEntry) return;

    /** ① 把当前答案并入数组 */
    const nextAnswers: Answer[] = [
      ...prevAnswers,
      { questionId: "Q1", answer },
    ];

    /** ② 计算下一页 id -> nextId */
    let nextId: string | undefined;
    if (typeof flowEntry.next === "string") {
      nextId = flowEntry.next;
    } else {
      nextId = flowEntry.next[answer];
    }
    if (!nextId) return;

    /** ③ 拼出真实路由 path */
    const path = nextId.startsWith("Q")
      ? `/optometrist/assess/questions/${nextId}`
      : `/optometrist/assess/${nextId}`;

    /** ④ 要带给下一页的 state */
    const navState: Record<string, unknown> = {
      answers: nextAnswers,
      patientId,
    };

    // 如果 nextId 不是问题页，而是推荐页（例如 recommendations/emergency-department）
    if (!nextId.startsWith("Q")) {
      // 取最后一段作为 recommendation 值，例如 "emergency-department"
      const recommendation = nextId.split("/").pop()!;
      navState.recommendation = recommendation;
    }

    navigate(path, { state: navState });
  };

  /* ---------- JSX ---------- */
  return (
    <>
      {/* 顶部栏 */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP</span>
        </div>
      </header>

      {/* 主体 */}
      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">{question}</h1>
            <p className="hint">Select one option</p>

            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q1"
                      value={o}
                      checked={answer === o}
                      onChange={() => setAnswer(o)}
                    />
                    {o}
                  </label>
                </li>
              ))}
            </ul>

            <button
              className="continue-button"
              disabled={!answer}
              onClick={handleNext}
            >
              Next
            </button>
          </section>
        </main>
      </div>

      {/* 自定义底部导航 */}
      <BottomNav />
    </>
  );
};

export default Q1;
