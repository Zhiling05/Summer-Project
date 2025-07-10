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

const Q3 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<string[]>([]);

  const question =
    "In relation to this patient's headache symptoms, please identify whether any of the following red-flag symptoms are present";
  const opts = [
    "A. A substantial change in the characteristics of the patient’s headache",
    "B. Headache that wakes them from sleep",
    "C. New-onset headache and a history of malignancy (lung, breast, melanoma, kidney, bowel)",
    "D. Progressively worsening headache with atypical presentation",
    "E. New-onset cognitive dysfunction (memory, concentration, problem-solving, speaking, understanding)",
    "F. Behavioural change, appetite and energy change in children",
    "G. Change in co-ordination in children",
    "H. None of the above",
  ];

  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q3"),
    []
  );

  const toggle = (label: string) => {
    setAnswers((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    if (!flowEntry) return;

    // Q3 only has a single string next
    const nextId =
      typeof flowEntry.next === "string"
        ? flowEntry.next
        : flowEntry.next["default"];

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
            <p className="hint">(Choose any that apply)</p>
            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="checkbox"
                      name="q3"
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

export default Q3;
