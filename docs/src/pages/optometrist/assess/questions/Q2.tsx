import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type FlowEntry =
  | { id: string; next: string }
  | { id: string; next: Record<string, string> };

const Q2 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  /* ---------- Q2 文案 ---------- */
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

  /* ---------- 从跳转表取 Q2 记录 ---------- */
  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q2"),
    []
  );

  const handleNext = () => {
    if (!flowEntry) return;

    let nextId: string | undefined;

    if (typeof flowEntry.next === "string") {
      nextId = flowEntry.next;
    } else {
      nextId = flowEntry.next[answer];
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
            <p className="hint">Select any that apply</p>

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


export default Q2;
