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

  /* ---------- Q1 文案 ---------- */
  const question = "Does the patient have a headache?";
  const opts = ["Yes", "No"];

  /* ---------- 从跳转表取 Q1 记录 ---------- */
  const flowEntry = useMemo<FlowEntry | undefined>(() => {
  const raw: any = flow;                       // JSON 默认类型是 any
  /** ① 若是 { questions: [...] } 取里面那一层；否则直接当数组用 */
  const list: FlowEntry[] = Array.isArray(raw.questions) ? raw.questions : raw;
  return list.find(f => f.id === 'Q1');
}, []);

  /* ---------- 跳转 ---------- */
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