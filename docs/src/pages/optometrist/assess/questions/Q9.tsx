// docs/src/pages/optometrist/assess/questions/Q9.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";
import BottomNav from "../../../../components/BottomNav";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type FlowEntry =
  | { id: string; next: string }
  | { id: string; next: Record<string, string> };

const Q9 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const question =
    "Does the patient report new-onset TVO — transient episodes of blurred vision, blackout or grey-out/loss of vision, typically precipitated by changes in posture or Valsalva manoeuvres (e.g. standing up, bending forward, coughing, or straining)?";
  const opts = ["Yes", "No"];

  // 读取跳转表中的 Q9 项
  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q9"),
    []
  );

  // 跳转处理
  const handleNext = () => {
    if (!flowEntry) return;

    const nextId =
      typeof flowEntry.next === "string"
        ? flowEntry.next
        : flowEntry.next[answer];

    if (!nextId) return;

    navigate(
      nextId.startsWith("Q")
        ? `/optometrist/assess/questions/${nextId}`
        : `/optometrist/assess/${nextId}`
    );
  };

  return (
    <>
      {/* ---------- 顶部栏 ---------- */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP</span>
        </div>
      </header>

      {/* ---------- 主体 ---------- */}
      <div className="nhsuk-width-container">
        <main id="maincontent">
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
                      name="q9"
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

      {/* 使用自定义底部导航栏 */}            
      <BottomNav />
    </>
  );
};

export default Q9;
