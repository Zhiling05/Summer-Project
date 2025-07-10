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

// docs/src/pages/optometrist/assess/questions/Q2.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

export default function Q2() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const question =
    "Has the patient experienced any of the following red-flag symptoms?";
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

  const handleNext = () => {
    if (!answer) return;

    if (answer !== "None of the above") {
      // 红旗症状 → 立即转诊
      navigate("../../recommendations/emergency-department");
    } else {
      // “None of the above” → 下一题 Q3
      navigate("../Q3");
    }
  };

  return (
    <>
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      <div className="nhsuk-width-container">
        <main id="maincontent">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">{question}</h1>
            <p className="hint">Select one option</p>
            <ul className="radio-list">
              {opts.map((opt) => (
                <li key={opt}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q2"
                      value={opt}
                      checked={answer === opt}
                      onChange={() => setAnswer(opt)}
                    />
                    {opt}
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

      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help
            in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              (opens in a new tab)
            </a>.
          </p>
          <hr />
          <ul className="footer-links">
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Privacy statement
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Terms and conditions
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Accessibility statement
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
