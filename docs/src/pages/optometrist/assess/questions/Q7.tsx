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

const Q7 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const question =
    "Does the patient have a latent or manifest squint (heterophoria or heterotropia) or uncorrected refractive error to explain the double vision?";
  const opts = ["Yes", "No"];

  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q7"),
    []
  );

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
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP</span>
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
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q7"
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

export default Q7;
