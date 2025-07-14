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

  /* ---------- Q3 文案 ---------- */
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

  /* ---------- 跳转表 ---------- */
  const flowEntry = useMemo(
    () => (flow as FlowEntry[]).find((f) => f.id === "Q3"),
    []
  );

  /* ---------- 勾选逻辑 ---------- */
  const toggle = (label: string) => {
    setAnswers((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  /* ---------- 跳转 ---------- */
  const handleNext = () => {
    if (!flowEntry) return;

    let nextId: string | undefined;

    if (typeof flowEntry.next === "string") {
      nextId = flowEntry.next; // 本例 = "Q4"
    } else {
      /* 如果以后需要根据答案分流，可在此解析 answers */
      // 例如：nextId = flowEntry.next["default"];
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

      {/* 使用自定义底部导航栏 */}            
      <BottomNav />
    </>
  );
};

export default Q3;
