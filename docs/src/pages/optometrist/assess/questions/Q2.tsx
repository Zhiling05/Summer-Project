import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";
import BottomNav from "../../../../components/BottomNav";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type Rule = {
  if: {
    notIncludes?: string;
    includesOnly?: string;
  };
  next: string;
};

type FlowEntry =
  | { id: string; next: string; rules?: never }
  | { id: string; next: Record<string, string>; rules?: Rule[] };

const Q2 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const question =
    "Has the patient experienced any of the following red flag symptoms?";
  const opts = [
    "Impaired level or decreased consciousness",
    "Seizures",
    "Stroke-like symptoms",
    "Thunderclap headache",
    "New-onset headache and vomiting",
    "Objective neurological deficit",
    "Worsening headache and fever",
    "None of the above",
  ];

  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q2"),
    []
  );

  const handleNext = () => {
    if (!flowEntry) return;
    let nextId: string | undefined;

    // 1️⃣ 优先按 rules 判断
    if ("rules" in flowEntry && Array.isArray(flowEntry.rules)) {
      for (const rule of flowEntry.rules) {
        const cond = rule.if;
        // any answer ≠ cond.notIncludes 就匹配第一条
        if (cond.notIncludes != null && answer !== cond.notIncludes) {
          nextId = rule.next;
          break;
        }
        // answer === cond.includesOnly
        if (cond.includesOnly != null && answer === cond.includesOnly) {
          nextId = rule.next;
          break;
        }
      }
    }

    // 2️⃣ 如果 rules 都没匹配，再 fallback 到 next.default 或直接 next
    if (!nextId) {
      if (typeof flowEntry.next === "string") {
        nextId = flowEntry.next;
      } else {
        nextId = flowEntry.next["default"];
      }
    }

    if (!nextId) return;
    const path = nextId.startsWith("Q")
      ? `/optometrist/assess/questions/${nextId}`
      : `/optometrist/assess/${nextId}`;

    navigate(path);
  };

  return (
    <>
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP</span>
        </div>
      </header>

      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">{question}</h1>
            <p className="hint">(Select any that apply)</p>

            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q2"
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

export default Q2;
