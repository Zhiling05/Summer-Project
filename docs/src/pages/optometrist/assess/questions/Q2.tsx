// docs/src/pages/optometrist/assess/questions/Q2.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Answer } from '../../../../api';
import { createAssessment } from '../../../../api';
import '../../../../styles/question.css';
import BottomNav from '../../../../components/BottomNav';
import NHSLogo from '../../../../assets/NHS_LOGO.jpg';
import DIPPLogo from '../../../../assets/DIPP_Study_logo.png';

interface LocationState {
  answers?: Answer[];
  patientId?: string;
}

export default function Q2() {
  const navigate = useNavigate();

  /* ---------- 上一题带过来的 state ---------- */
  const { state } = useLocation() as { state: LocationState };
  const prevAnswers = state?.answers ?? [];
  const patientId = state?.patientId ?? `pid-${Date.now().toString(36)}`;

  /* ---------- 本题内容 ---------- */
  const [answer, setAnswer] = useState('');

  const question =
    'Has the patient experienced any of the following red-flag symptoms?';
  const opts = [
    'Impaired level or decreased consciousness',
    'Seizures',
    'Stroke-like symptoms',
    'Thunderclap headache',
    'New-onset headache and vomiting',
    'Objective neurological deficit',
    'Worsening headache and fever',
    'None of the above',
  ];

  /* ---------- 下一步 ---------- */
  const handleNext = async () => {
    if (!answer) return;

    /* 把本题答案加入数组（含题干 question） */
    const newAnswers: Answer[] = [
      ...prevAnswers,
      {
        questionId: 'Q2',
        question, // 题干一起送后端
        answer,
      },
    ];

    if (answer !== 'None of the above') {
      /* 红旗症状 -> 先保存 assessment，再跳急诊推荐页 */
      try {
        const { id } = await createAssessment({
          role: 'optometrist',
          patientId,
          answers: newAnswers,
          recommendation: 'EmergencyDepartment',
        });

        navigate('../../recommendations/EMERGENCY_DEPARTMENT', {
          state: {
            assessmentId: id, // 带给推荐页使用
            answers: newAnswers,
            patientId,
          },
        });
      } catch (e) {
        alert('Save failed: ' + (e as Error).message);
      }
    } else {
      /* 正常流程 -> 下一题 Q3 */
      navigate('../Q3', {
        state: {
          answers: newAnswers,
          patientId,
        },
      });
    }
  };

  /* ---------- JSX ---------- */
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
        <main id="maincontent" className="nhsuk-main-wrapper">
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

      <BottomNav />
    </>
  );
}
