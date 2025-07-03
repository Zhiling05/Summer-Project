import "../../../../styles/question.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Q1 = () => {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

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

  return (
    <>
      {/* ---------- NHS 顶栏 ---------- */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img
            className="nhs-logo"
            src="https://assets.nhs.uk/tools/downloads/identity/nhs-logo.svg"
            alt="NHS logo"
          />
          <span className="nhs-header__service">DIPP 顶尖研究小组</span>
        </div>
      </header>

      {/* ---------- 页面主体 ---------- */}
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper" id="maincontent">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-card">
            <h1 className="nhsuk-heading-l">
              Has the patient experienced any of the following red-flag symptoms?
            </h1>
            <p className="lead">(Select any that apply)</p>

            <ul className="radio-list">
              {opts.map((o) => (
                <li key={o}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q1"
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
              onClick={() =>
                navigate("/optometrist/assess/questions/Q2")
              }
            >
              Next
            </button>
          </section>
        </main>
      </div>
    </>
  );
};

export default Q1;
