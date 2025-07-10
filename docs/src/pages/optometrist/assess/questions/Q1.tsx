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

const Q1 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  // 文案 & 选项由 TSX 里定义
  const question = "Does the patient have a headache?";
  const opts = ["Yes", "No"];

  // 读取 JSON 中 Q1 的跳转表
  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q1"),
    []
  );

  const handleNext = () => {
    if (!flowEntry) return;
    let nextId: string | undefined;

    // 如果 next 是字符串（未作分支），直接用它
    if (typeof flowEntry.next === "string") {
      nextId = flowEntry.next;
    } else {
      // next 是一个映射表，根据答案读取
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

export default Q1;
