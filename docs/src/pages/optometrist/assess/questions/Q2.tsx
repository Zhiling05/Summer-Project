<<<<<<< HEAD

function Q2() {
  return (
    <div>
      <h2>Question 2</h2>
      {/* 放置题干和选项占位 */}
    </div>
  );
}

export default Q2;
=======
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
>>>>>>> remotes/origin/Junjie_develop
