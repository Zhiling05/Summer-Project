import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type Rule = {
  if: {
    "Q3.includesAny"?: string[];
    "Q3.includesOnly"?: string[];
    "Q4.includesTwoOrMore"?: string[];
    "Q4.includesExactlyOneOf"?: string[];
    "Q4.includes"?: string[];
  };
  next: string;
};

type FlowEntry =
  | { id: string; next: string; rules?: never }
  | { id: string; next: Record<string, string>; rules?: Rule[] };

const Q4 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<string[]>([]);

  const question =
    "Does the patient also present with any of the following symptoms?";
  const opts = [
    "A. Change in personality",
    "B. Headache worst in the morning",
    "C. Pulsatile tinnitus (pulsates in time with heart beat)",
    "D. New-onset headache in someone with compromised immunity (HIV, immunosuppressive drugs)",
    "E. None of the above",
  ];

  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q4"),
    []
  );

  const toggle = (label: string) => {
    setAnswers((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    if (!flowEntry || !Array.isArray(flowEntry.rules)) return;

    let nextId: string | undefined;

    // 遍历 rules
    for (const rule of flowEntry.rules) {
      const c = rule.if;
      // Q3.includesAny
      if (c["Q3.includesAny"]?.some((opt) => opt && c["Q3.includesAny"]?.includes(opt) && answers.some((a) => a.startsWith(opt.charAt(0))))) {
        nextId = rule.next; break;
      }
      // Q3.includesOnly + Q4.includesTwoOrMore
      if (
        c["Q3.includesOnly"] &&
        answers.length === 0 &&
        c["Q4.includesTwoOrMore"] &&
        answers.filter((a) => c["Q4.includesTwoOrMore"]!.some((opt) => a.startsWith(opt))).length >= 2
      ) {
        nextId = rule.next; break;
      }
      // Q3.includesOnly + includesExactlyOneOf
      if (
        c["Q3.includesOnly"] &&
        answers.length === 0 &&
        c["Q4.includesExactlyOneOf"] &&
        answers.filter((a) => c["Q4.includesExactlyOneOf"]!.some((opt) => a.startsWith(opt))).length === 1
      ) {
        nextId = rule.next; break;
      }
      // Q3.includesOnly + Q4.includes E
      if (
        c["Q3.includesOnly"] &&
        answers.length === 0 &&
        c["Q4.includes"] &&
        answers.some((a) => a.startsWith("E"))
      ) {
        nextId = rule.next; break;
      }
    }

    if (!nextId) {
      // fallback
      nextId = typeof flowEntry.next === "string"
        ? flowEntry.next
        : flowEntry.next["default"];
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
            <p className="hint">Select all symptoms that the patient has</p>
            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="checkbox"
                      name="q4"
                      value={o}
                      checked={answers.includes(o)}
                      onChange={() => toggle(o)}
                    />
                    {o}
                  </label>
                </li>
              ))}
            </ul>
            <button
              className="continue-button"
              disabled={answers.length === 0}
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
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Q4;
