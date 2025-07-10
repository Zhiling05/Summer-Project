import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import flow from "../../../../data/questionnaire.json";

type FlowEntry =
  | { id: string; next: string }
  | { id: string; next: Record<string, string> };

const Q5 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const question =
    "Does the patient report new-onset TVO — transient episodes of blurred vision, blackout or grey-out/loss of vision, typically precipitated by changes in posture or Valsalva manoeuvres?";
  const opts = ["Yes", "No"];

  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q5"),
    []
  );

  const handleNext = () => {
    if (!flowEntry) return;
    let nextId: string;

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
            <p className="hint">Select one option</p>
            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q5"
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

export default Q5;
