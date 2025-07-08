<<<<<<< HEAD

function Q4() {
  return (
    <div>
      <h2>Question 4</h2>
      {/* 放置题干和选项占位 */}
    </div>
  );
}
=======
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type FlowEntry =
  | { id: string; next: string }
  | { id: string; next: Record<string, string> };

const Q4 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<string[]>([]);

  /* ---------- Q4 文案 ---------- */
  const question =
    "Does the patient also present with any of the following symptoms?";
  const opts = [
    "A. Change in personality",
    "B. Headache worst in the morning",
    "C. Pulsatile tinnitus (pulsates in time with heart beat)",
    "D. New-onset headache in someone with compromised immunity (HIV, immunosuppressive drugs)",
    "E. None of the above",
  ];

  /* ---------- 跳转表 ---------- */
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
    if (!flowEntry) return;

    let nextId: string | undefined;

    if (typeof flowEntry.next === "string") {
      nextId = flowEntry.next; // 预期 = "Q5"
    } else {
      /* 如需分流可在此解析 answers */
      nextId = Object.values(flowEntry.next)[0];
    }

    if (!nextId) return;

    const path = nextId.startsWith("Q")
      ? `/optometrist/assess/questions/${nextId}`
      : `/optometrist/assess/${nextId}`;

    navigate(path);
  };

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
        <main id="maincontent">
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

       {/* ---------- 页脚 ---------- */}
      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help
            in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              (opens in a new tab)
            </a>.
          </p>
          <p>
            This website only stores the cookies that are needed to make it
            work.&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              Read more about how we use cookies
            </a>{" "}
            (opens in a new tab).
          </p>
          <hr />
          <p>The following links open in a new tab:</p>
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
};

>>>>>>> remotes/origin/Junjie_develop

export default Q4;
