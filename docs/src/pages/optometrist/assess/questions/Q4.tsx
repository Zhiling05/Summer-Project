import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";
import BottomNav from "../../../../components/BottomNav";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import { recordAnswer, getNextId } from "../../../../Core/flow";

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
    "E. None of the above"
  ];

  /* ---------- 复选框 ---------- */
  const toggle = (label: string) => {
    setAnswers(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  /* ---------- 跳转 ---------- */
  const handleNext = () => {
    recordAnswer("Q4", answers);                     // ① 记录答案
    const nextId = getNextId("Q4", answers);         // ② 解析下一题
    if (!nextId) return;

    const path = nextId.startsWith("Q")
      ? `/optometrist/assess/questions/${nextId}`
      : `/optometrist/assess/${nextId}`;

    navigate(path);                                  // ③ 跳转
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
              {opts.map(o => (
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

      <BottomNav />
    </>
  );
};

export default Q4;
